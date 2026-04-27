# Task: Add Form Email Submission Feature

## Steps
- [x] 1. Update script.js to send form data via fetch() to FormSubmit.co
- [x] 2. Update index.html form if needed (add action/method attributes as fallback)
- [x] 3. Test and verify the form submission flow

## Status
Completed. The appointment form now sends submissions to satyanandhospitalspn@gmail.com via FormSubmit.co (free, no-signup required).

## How it works
- Form data (name, phone, message) is sent via `fetch()` to `https://formsubmit.co/ajax/satyanandhospitalspn@gmail.com`
- User sees a "Sending your request…" message while submitting
- On success: green confirmation message appears and form resets
- On error: red error message appears suggesting to call directly

## Notes
- FormSubmit.co is a free service that works without any account/API key for the first few submissions
- If you need higher volume or want to customize the email template, create a free account at formsubmit.co


