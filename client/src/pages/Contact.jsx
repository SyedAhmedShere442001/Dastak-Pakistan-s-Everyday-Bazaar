import { Link } from 'react-router-dom';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer:
      'Orders are dispatched within 24 hours and typically arrive in 3–5 working days. Remote areas may take an extra day or two.'
  },
  {
    question: 'Is cash on delivery available?',
    answer:
      'Yes. You can pay in cash at your doorstep anywhere we deliver, or choose Easypaisa, JazzCash or bank transfer if you prefer.'
  },
  {
    question: 'What is your return policy?',
    answer:
      'Unused items in their original packaging can be returned within 7 days of delivery. Message us on WhatsApp and we will guide you through it.'
  },
  {
    question: 'Do you deliver outside major cities?',
    answer:
      'We deliver to over 40 cities through our courier partners. Send us your city and area code on WhatsApp and we will confirm before you order.'
  }
];

export default function Contact() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact us</span>
          </nav>
          <h1>We are a message away.</h1>
          <p>
            Questions about an order, a product or delivery to your area? Our team reads every
            message.
          </p>
        </div>
      </section>

      <div className="container contact-layout">
        <div className="contact-cards">
          <a className="contact-card" href="tel:03001112233">
            <span className="contact-icon">
              <Phone size={20} />
            </span>
            <div>
              <strong>Call us</strong>
              <span>0300 111 2233</span>
              <small>Mon–Sat, 9am–9pm PKT</small>
            </div>
          </a>

          <a
            className="contact-card"
            href="https://wa.me/923001112233"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-icon">
              <MessageCircle size={20} />
            </span>
            <div>
              <strong>WhatsApp</strong>
              <span>0300 111 2233</span>
              <small>Fastest for order updates</small>
            </div>
          </a>

          <a className="contact-card" href="mailto:salam@dastak.pk">
            <span className="contact-icon">
              <Mail size={20} />
            </span>
            <div>
              <strong>Email</strong>
              <span>salam@dastak.pk</span>
              <small>We reply within one working day</small>
            </div>
          </a>

          <div className="contact-card">
            <span className="contact-icon">
              <MapPin size={20} />
            </span>
            <div>
              <strong>Studio</strong>
              <span>Gulberg III, Lahore</span>
              <small>Punjab, Pakistan</small>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <Clock3 size={20} />
            </span>
            <div>
              <strong>Hours</strong>
              <span>Monday–Saturday</span>
              <small>9:00am – 9:00pm PKT</small>
            </div>
          </div>
        </div>

        <div className="contact-faq">
          <span className="eyebrow">Quick answers</span>
          <h2>Frequently asked</h2>
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
          <p className="contact-note">
            Still stuck? Write to <a href="mailto:salam@dastak.pk">salam@dastak.pk</a> with your
            order number and we will sort it out.
          </p>
        </div>
      </div>
    </>
  );
}
