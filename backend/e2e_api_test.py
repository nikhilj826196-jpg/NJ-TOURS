import httpx
import sys
import datetime
import time

BASE_URL = "http://localhost:8000/api/v1"

def print_result(name, passed, msg=""):
    status = "PASS" if passed else "FAIL"
    print(f"- {name}: {status} {msg}")
    if not passed:
        print(f"FAILED. Exiting.")
        sys.exit(1)

def run_tests():
    client = httpx.Client(base_url=BASE_URL)
    
    # 1. Customer login: wrong password
    try:
        r = client.post("/auth/login", data={"username": "customer@example.com", "password": "wrongpassword"})
        if r.status_code == 401:
            print_result("Wrong password", True)
        else:
            print_result("Wrong password", False, f"Expected 401, got {r.status_code}")
    except Exception as e:
        print_result("Wrong password", False, str(e))

    # 2. Customer login: correct password
    customer_token = ""
    try:
        r = client.post("/auth/login", data={"username": "customer@example.com", "password": "Password123!"})
        if r.status_code == 200:
            data = r.json()
            customer_token = data.get("access_token")
            print_result("Customer login", True)
        else:
            print_result("Customer login", False, f"Expected 200, got {r.status_code}")
    except Exception as e:
        print_result("Customer login", False, str(e))

    customer_headers = {"Authorization": f"Bearer {customer_token}"}

    # 3. Create a real booking
    booking_id = ""
    try:
        # Get a vehicle first
        r_veh = client.get("/vehicles")
        vehicles = r_veh.json().get("data", [])
        if not vehicles:
            print_result("Booking creation", False, "No vehicles found to book")
        
        vehicle_id = vehicles[0]["id"]
        
        booking_data = {
            "vehicle_id": vehicle_id,
            "trip_type": "ONE_WAY",
            "pickup_location": "Mumbai",
            "drop_location": "Pune",
            "pickup_date": (datetime.date.today() + datetime.timedelta(days=1)).isoformat(),
            "pickup_time": "10:00 AM",
            "passengers": 2,
            "distance_km": 150.0,
            "estimated_duration": "3 Hours"
        }
        
        r = client.post("/bookings", json=booking_data, headers=customer_headers)
        if r.status_code == 201:
            booking = r.json()["data"]
            booking_id = booking["id"]
            print_result("Booking creation", True, f"(ID: {booking_id})")
        else:
            print_result("Booking creation", False, f"Expected 201, got {r.status_code}: {r.text}")
    except Exception as e:
        print_result("Booking creation", False, str(e))

    # 5. Admin Login
    admin_token = ""
    try:
        r = client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123!"})
        admin_token = r.json().get("access_token")
        if admin_token:
            print_result("Admin login", True)
        else:
            print_result("Admin login", False, "No token returned")
    except Exception as e:
        print_result("Admin login", False, str(e))

    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 6. Admin booking visibility
    try:
        r = client.get("/bookings", headers=admin_headers)
        bookings = r.json()["data"]
        if any(b["id"] == booking_id for b in bookings):
            print_result("Admin booking visibility", True)
        else:
            print_result("Admin booking visibility", False, "Booking not found in admin list")
    except Exception as e:
        print_result("Admin booking visibility", False, str(e))

    # 7. Driver assignment
    driver_id = ""
    try:
        # Need to find a driver ID, let's list drivers if possible, or just login as driver to get ID?
        # Let's get drivers list or get self user ID if we login as driver
        r_drv = client.post("/auth/login", data={"username": "driver@example.com", "password": "Password123!"})
        drv_token = r_drv.json()["access_token"]
        r_me = client.get("/auth/me", headers={"Authorization": f"Bearer {drv_token}"})
        driver_id = r_me.json()["data"]["id"]
        
        r = client.put(f"/bookings/{booking_id}/assign-driver", json={"driver_id": driver_id}, headers=admin_headers)
        if r.status_code == 200:
            print_result("Driver assignment", True)
        else:
            print_result("Driver assignment", False, r.text)
    except Exception as e:
        print_result("Driver assignment", False, str(e))

    # 10. Complete/test payment flow
    payment_id = ""
    razorpay_order_id = ""
    try:
        # Create order
        r_order = client.post("/payments/create-order", json={"booking_id": booking_id, "amount": 1000.0, "payment_method": "UPI"}, headers=customer_headers)
        if r_order.status_code == 201:
            payment_data = r_order.json()["data"]
            razorpay_order_id = payment_data["razorpay_order_id"]
            
            # Verify payment
            verify_payload = {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": "pay_test123",
                "razorpay_signature": "test_sig_12345"
            }
            r_verify = client.post("/payments/verify", json=verify_payload, headers=customer_headers)
            if r_verify.status_code == 200:
                payment_id = r_verify.json()["data"]["id"]
                print_result("Payment", True)
            else:
                print_result("Payment", False, f"Verification failed: {r_verify.text}")
        else:
            print_result("Payment", False, f"Order creation failed: {r_order.text}")
    except Exception as e:
        print_result("Payment", False, str(e))

    # 11-12. Customer Payments
    try:
        r = client.get("/payments/history", headers=customer_headers)
        payments = r.json()["data"]
        found = False
        for p in payments:
            if p["booking_id"] == booking_id and p["status"] == "CAPTURED":
                found = True
                break
        if found:
            print_result("Customer Payments", True)
        else:
            print_result("Customer Payments", False, "Payment not found in history")
    except Exception as e:
        print_result("Customer Payments", False, str(e))

    # 13. Customer isolation/security
    try:
        # Create second customer
        r_reg = client.post("/auth/register", json={
            "full_name": "Test Cust 2",
            "email": "cust2@test.com",
            "phone": "9999999999",
            "password": "Password123!"
        })
        r_c2 = client.post("/auth/login", data={"username": "cust2@test.com", "password": "Password123!"})
        c2_headers = {"Authorization": f"Bearer {r_c2.json()['access_token']}"}
        
        # try to get booking
        r_get_b = client.get(f"/bookings/{booking_id}", headers=c2_headers)
        r_get_p = client.get(f"/payments/{payment_id}", headers=c2_headers)
        
        if r_get_b.status_code == 403 and r_get_p.status_code == 403:
            print_result("Customer isolation/security", True)
        else:
            print_result("Customer isolation/security", False, f"Expected 403, got {r_get_b.status_code} and {r_get_p.status_code}")
    except Exception as e:
         print_result("Customer isolation/security", False, str(e))

    # 14-16. Booking cancellation
    try:
        # Cancel booking as customer
        # Assuming the status endpoint is used for cancellation
        cancel_payload = {
            "status": "CANCELLED"
        }
        r_cancel = client.put(f"/bookings/{booking_id}/status", json=cancel_payload, headers=customer_headers)
        if r_cancel.status_code == 200:
            print_result("Booking cancellation", True)
        else:
            print_result("Booking cancellation", False, r_cancel.text)
    except Exception as e:
        print_result("Booking cancellation", False, str(e))

    # 19. Admin cancellation visibility
    try:
        r_admin_b = client.get(f"/bookings/{booking_id}", headers=admin_headers)
        if r_admin_b.status_code == 200 and r_admin_b.json()["data"]["status"] == "CANCELLED":
            print_result("Admin cancellation visibility", True)
        else:
            print_result("Admin cancellation visibility", False)
    except Exception as e:
        print_result("Admin cancellation visibility", False, str(e))


if __name__ == "__main__":
    run_tests()
