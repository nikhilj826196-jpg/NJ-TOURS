import time
from app.core.celery_app import celery_app


@celery_app.task(name="tasks.send_async_notification")
def send_async_notification(channel: str, recipient: str, subject: str, message: str) -> dict:
    """
    Simulates sending email/SMS asynchronously via Celery worker.
    """
    print(f"[Celery] Sending notification via {channel} to {recipient}...")
    # Simulate API communication delay
    time.sleep(2)
    print(f"[Celery] Notification successfully delivered to {recipient}.")
    return {
        "status": "success",
        "channel": channel,
        "recipient": recipient,
        "timestamp": time.time()
    }


@celery_app.task(name="tasks.generate_pdf_invoice")
def generate_pdf_invoice(booking_id: str) -> dict:
    """
    Simulates compiling a PDF invoice for a completed booking in the background.
    """
    print(f"[Celery] Compiling PDF tax invoice for booking {booking_id}...")
    time.sleep(3)
    print(f"[Celery] PDF generated successfully.")
    return {
        "status": "success",
        "booking_id": booking_id,
        "invoice_url": f"/uploads/invoices/INV-{booking_id}.pdf"
    }
