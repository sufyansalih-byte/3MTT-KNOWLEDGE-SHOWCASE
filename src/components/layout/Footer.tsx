import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Find Placements', href: '/placements' },
    { label: 'Brief History', href: '/history' },
    { label: 'About', href: '/about' },
  ],
  resources: [
    { label: 'SIWES Guide', href: '/history' },
    { label: 'Blog', href: '#' },
    { label: 'FAQs', href: '/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-app py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">
                SIWES<span className="text-primary-400">Connect</span>
              </span>
            </Link>
            <p className="text-secondary-400 text-sm leading-relaxed max-w-sm mb-6">
              Empowering Nigerian students to find meaningful SIWES placements with verified organizations.
              Building the bridge between education and industry.
            </p>

            <div className="space-y-3 text-sm">
              
                href="mailto:sufyaneneye752@gmail.com"
                className="flex items-center gap-3 text-secondary-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                sufyaneneye752@gmail.com
              </a>
              
                href="https://wa.me/2349034156446"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-secondary-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +234 903 415 6446 (WhatsApp)
              </a>
              <p className="flex items-center gap-3 text-secondary-400">
                <MapPin className="w-4 h-4" />
                Niger State, Nigeria
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-secondary-800 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-700 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-secondary-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-secondary-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-secondary-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-800">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-500 text-center md:text-left">
              {currentYear} SIWES Connect. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-secondary-500">
              <span>Made with care for Nigerian students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
