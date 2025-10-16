
import React, { useState } from 'react';
import { personalInfo } from '../constants';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';
import { useOnScreen } from '../hooks/useOnScreen';

const Contact: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('Thank you for your message!');
        const form = e.target as HTMLFormElement;
        form.reset();
        setTimeout(() => setStatus(''), 5000);
    };

  return (
    <section id="contact" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Contact <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Me</span>
        </h2>
        <div ref={ref} className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-slate-900/50 p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700 fade-in-up ${isVisible ? 'visible' : ''}`}>
          
          <div className="flex flex-col justify-center space-y-8">
            <h3 className="text-3xl font-bold text-white">Let's Connect</h3>
            <p className="text-slate-400">
              I'm open to new opportunities and collaborations. Feel free to reach out via email or phone.
            </p>
            <div className="space-y-4">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-4 group">
                <EmailIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform"/>
                <span className="text-slate-300 group-hover:text-white transition-colors">{personalInfo.email}</span>
              </a>
               <a href={`tel:${personalInfo.phone}`} className="flex items-center space-x-4 group">
                <PhoneIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform"/>
                <span className="text-slate-300 group-hover:text-white transition-colors">{personalInfo.phone}</span>
              </a>
               <div className="flex items-center space-x-4">
                <LocationIcon className="w-6 h-6 text-cyan-400"/>
                <span className="text-slate-300">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-500 peer" placeholder=" " required />
                <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
            </div>
             <div className="relative z-0 w-full mb-6 group">
                <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-500 peer" placeholder=" " required />
                <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            </div>
             <div className="relative z-0 w-full mb-6 group">
                <textarea name="floating_message" id="floating_message" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-500 peer min-h-[100px]" placeholder=" " required></textarea>
                <label htmlFor="floating_message" className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Your Message</label>
            </div>
            <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105">Send Message</button>
            {status && <p className="mt-4 text-green-400">{status}</p>}
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;
