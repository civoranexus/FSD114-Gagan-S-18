"""
Certificate PDF Generation Utility

Generates course completion certificates in PDF format with EduVillage branding.
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from io import BytesIO
from datetime import datetime
import os


def generate_certificate_pdf(student_name, course_title, issued_date):
    """
    Generate a course completion certificate as PDF.
    
    Args:
        student_name (str): Full name of the student
        course_title (str): Title of the completed course
        issued_date (datetime): Date the certificate was issued
    
    Returns:
        BytesIO: PDF file as bytes
    """
    # Create a PDF buffer
    pdf_buffer = BytesIO()
    
    # Set up page size (A4 landscape for certificates)
    page_width, page_height = letter
    
    # Create canvas
    cert_canvas = canvas.Canvas(pdf_buffer, pagesize=(page_width, page_height))
    
    # Set font sizes and colors
    title_size = 48
    subtitle_size = 28
    body_size = 14
    
    # EduVillage Colors
    primary_color = HexColor('#1B9AAA')  # Teal
    secondary_color = HexColor('#142C52')  # Navy
    text_color = HexColor('#333333')  # Dark gray
    
    # Set up margins
    margin = 0.5 * inch
    
    # ===== DECORATIVE BORDER =====
    border_thickness = 2
    cert_canvas.setStrokeColor(primary_color)
    cert_canvas.setLineWidth(border_thickness)
    cert_canvas.rect(
        margin,
        margin,
        page_width - (2 * margin),
        page_height - (2 * margin)
    )
    
    # Inner border (thinner)
    cert_canvas.setLineWidth(1)
    inner_margin = margin + 0.15 * inch
    cert_canvas.rect(
        inner_margin,
        inner_margin,
        page_width - (2 * inner_margin),
        page_height - (2 * inner_margin)
    )
    
    # ===== HEADER: EDUVILLAGE BRANDING =====
    cert_canvas.setFillColor(primary_color)
    cert_canvas.setFont("Helvetica-Bold", 24)
    cert_canvas.drawString(
        page_width / 2 - 1 * inch,
        page_height - 1 * inch,
        "🎓 EduVillage"
    )
    
    # ===== TITLE =====
    y_position = page_height - 1.6 * inch
    cert_canvas.setFillColor(secondary_color)
    cert_canvas.setFont("Helvetica-Bold", title_size)
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position,
        "Certificate of Completion"
    )
    
    # ===== DECORATIVE LINE =====
    y_position -= 0.4 * inch
    line_start_x = page_width / 2 - 2 * inch
    line_end_x = page_width / 2 + 2 * inch
    cert_canvas.setStrokeColor(primary_color)
    cert_canvas.setLineWidth(3)
    cert_canvas.line(line_start_x, y_position, line_end_x, y_position)
    
    # ===== BODY TEXT =====
    y_position -= 0.6 * inch
    
    # "This is to certify that"
    cert_canvas.setFillColor(text_color)
    cert_canvas.setFont("Helvetica", body_size)
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position,
        "This is to certify that"
    )
    
    # Student name (highlighted)
    y_position -= 0.4 * inch
    cert_canvas.setFillColor(primary_color)
    cert_canvas.setFont("Helvetica-Bold", 32)
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position,
        student_name
    )
    
    # "has successfully completed"
    y_position -= 0.5 * inch
    cert_canvas.setFillColor(text_color)
    cert_canvas.setFont("Helvetica", body_size)
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position,
        "has successfully completed the course"
    )
    
    # Course title (highlighted)
    y_position -= 0.4 * inch
    cert_canvas.setFillColor(secondary_color)
    cert_canvas.setFont("Helvetica-Bold", 28)
    
    # Handle long course titles
    if len(course_title) > 40:
        # Split into multiple lines if needed
        words = course_title.split()
        lines = []
        current_line = []
        for word in words:
            current_line.append(word)
            if len(' '.join(current_line)) > 40:
                lines.append(' '.join(current_line[:-1]))
                current_line = [word]
        lines.append(' '.join(current_line))
        
        for i, line in enumerate(lines):
            cert_canvas.drawCentredString(
                page_width / 2,
                y_position - (i * 0.35 * inch),
                line
            )
        y_position -= (len(lines) - 1) * 0.35 * inch
    else:
        cert_canvas.drawCentredString(
            page_width / 2,
            y_position,
            course_title
        )
    
    # Date of completion
    y_position -= 0.7 * inch
    cert_canvas.setFillColor(text_color)
    cert_canvas.setFont("Helvetica", body_size)
    formatted_date = issued_date.strftime("%B %d, %Y")
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position,
        f"Completed on: {formatted_date}"
    )
    
    # ===== FOOTER =====
    y_position = 0.8 * inch
    
    cert_canvas.setFillColor(text_color)
    cert_canvas.setFont("Helvetica-Oblique", 10)
    cert_canvas.drawString(
        page_width / 2 - 1.5 * inch,
        y_position,
        "Certificate ID: " + str(int(datetime.now().timestamp()))
    )
    
    cert_canvas.drawCentredString(
        page_width / 2,
        y_position - 0.25 * inch,
        "Issued by EduVillage - Online Learning Platform"
    )
    
    # Save the canvas to the buffer
    cert_canvas.save()
    
    # Move buffer pointer to beginning
    pdf_buffer.seek(0)
    
    return pdf_buffer


def save_certificate_pdf(certificate_obj, student_name, course_title):
    """
    Generate and save certificate PDF to model's file field.
    
    Args:
        certificate_obj (Certificate): Certificate model instance
        student_name (str): Full name of the student
        course_title (str): Title of the completed course
    
    Returns:
        str: Path to saved file
    """
    # Generate PDF
    pdf_buffer = generate_certificate_pdf(student_name, course_title, certificate_obj.issued_at)
    
    # Create filename
    filename = f"certificate_{certificate_obj.student.id}_{certificate_obj.course.id}_{int(datetime.now().timestamp())}.pdf"
    
    # Save to certificate_file field
    certificate_obj.certificate_file.save(filename, pdf_buffer, save=True)
    
    return certificate_obj.certificate_file.url
