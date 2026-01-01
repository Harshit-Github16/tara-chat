const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.submitContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        if (!firstName || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailData = {
            from: 'onboarding@resend.dev',
            to: 'hello@tara4u.com',
            reply_to: email,
            subject: `Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f43f5e;">New Contact Form Submission</h2>
          <div style="background-color: #fff1f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> \${firstName} \${lastName || ''}</p>
            <p><strong>Email:</strong> <a href="mailto:\${email}">\${email}</a></p>
            <p><strong>Subject:</strong> \${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #fecdd3; border-radius: 8px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">\${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This email was sent from the Tara4u contact form.
          </p>
        </div>
      `
        };

        if (process.env.RESEND_API_KEY) {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer \${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Resend API error:', data);
                throw new Error('Failed to send email via Resend');
            }

            console.log('Email sent successfully via Resend:', data);
        } else {
            console.log('Contact form submission (no email service configured):', {
                firstName,
                lastName,
                email,
                subject,
                message
            });
        }

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
};
