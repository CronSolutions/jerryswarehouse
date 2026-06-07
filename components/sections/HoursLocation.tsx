"use client";

import { useEffect, useRef } from "react";
import { Clock, MapPin, Phone, Navigation, Mail, ShoppingBag } from "lucide-react";
import { STORE_HOURS, STORE_INFO } from "@/lib/constants";

function getTodayIndex(): number {
  const d = new Date().getDay();
  // JS: 0=Sun, 1=Mon... our array: 0=Mon, 6=Sun
  return d === 0 ? 6 : d - 1;
}

export default function HoursLocation() {
  const sectionRef = useRef<HTMLElement>(null);
  const todayIndex = getTodayIndex();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els =
              entry.target.querySelectorAll<HTMLElement>(".animate-on-scroll");
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add("in-view"), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      aria-labelledby="hours-heading"
      className="py-24 lg:py-32 bg-[#f3ece0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-eyebrow mb-4">Find Us</p>
          <h2
            id="hours-heading"
            className="font-serif text-4xl md:text-5xl font-bold text-[#3d2c1a] mb-5 leading-tight"
          >
            Hours &amp;{" "}
            <em className="text-[#c49335] not-italic">Location</em>
          </h2>
          <div className="gold-divider mx-auto" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Hours card */}
          <div className="animate-on-scroll stagger-1">
            <div className="bg-[#ede6d7] border border-[#d9cdb8] rounded-2xl p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 bg-[#d9cdb8] rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Clock size={18} className="text-[#c49335]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#3d2c1a]">
                  Store Hours
                </h3>
              </div>

              <table className="w-full" aria-label="Store hours by day">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {STORE_HOURS.map((row, i) => {
                    const isToday = i === todayIndex;
                    return (
                      <tr
                        key={row.day}
                        className={`transition-colors ${
                          isToday
                            ? "bg-[#d4a853]/8 rounded-lg"
                            : ""
                        }`}
                        aria-current={isToday ? "date" : undefined}
                      >
                        <td
                          className={`py-3 px-3 font-medium text-sm rounded-l-lg ${
                            isToday
                              ? "text-[#c49335] font-semibold"
                              : "text-[#6b5444]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isToday && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-[#c49335] flex-shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            {row.day}
                            {isToday && (
                              <span className="text-xs bg-[#c49335]/15 text-[#c49335] px-1.5 py-0.5 rounded font-medium ml-1">
                                Today
                              </span>
                            )}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-3 text-sm text-right rounded-r-lg font-mono ${
                            row.closed
                              ? "text-[#9a7f6a] italic"
                              : isToday
                              ? "text-[#c49335] font-semibold"
                              : "text-[#6b5444]"
                          }`}
                        >
                          {row.closed
                            ? "Closed"
                            : `${row.open} – ${row.close}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Contact info */}
              <div className="mt-8 pt-8 border-t border-[#d9cdb8] space-y-4">
                <a
                  href={`tel:${STORE_INFO.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 text-[#6b5444] hover:text-[#c49335] transition-colors duration-200 group"
                  aria-label={`Call us at ${STORE_INFO.phone}`}
                >
                  <Phone
                    size={16}
                    className="text-[#c49335]/60 group-hover:text-[#c49335] transition-colors flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">{STORE_INFO.phone}</span>
                </a>
                <a
                  href="https://www.ebay.com/usr/miso_242497?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=vrnrm_g4r4u&sssrc=4623447&ssuid=vrnrm_g4r4u&stype=1&widget_ver=artemis&media=COPY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#6b5444] hover:text-[#c49335] transition-colors duration-200 group"
                  aria-label="Visit Jerry's Warehouse on eBay"
                >
                  <ShoppingBag
                    size={16}
                    className="text-[#c49335]/60 group-hover:text-[#c49335] transition-colors flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Shop us on eBay</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map card */}
          <div className="animate-on-scroll stagger-2">
            <div className="bg-[#ede6d7] border border-[#d9cdb8] rounded-2xl overflow-hidden h-full flex flex-col">
              {/* Map embed */}
              <div className="relative flex-1 min-h-[300px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2952.360337545654!2d-71.81030538793966!3d42.27083087108138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e38d405c98edaf%3A0x532fad0eab9785f1!2sJerry&#39;s%20Warehouse!5e0!3m2!1sen!2sus!4v1780863371163!5m2!1sen!2sus" 
                  width="450" 
                  height="310" 
                  
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>

                {/* Map overlay for styling */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 70%, rgba(237,230,215,0.3) 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Address + directions */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-5">
                  <div
                    className="w-9 h-9 bg-[#d9cdb8] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <MapPin size={15} className="text-[#c49335]" strokeWidth={1.5} />
                  </div>
                  <address className="not-italic">
                    <p className="font-semibold text-[#3d2c1a] text-sm">
                      {STORE_INFO.address.street}
                    </p>
                    <p className="text-[#6b5444] text-sm">
                      {STORE_INFO.address.city}, {STORE_INFO.address.state}{" "}
                      {STORE_INFO.address.zip}
                    </p>
                  </address>
                </div>

                <a
                  href={STORE_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-[#c49335] hover:bg-[#d4a853] text-[#faf6ed] font-semibold text-sm rounded-lg transition-colors duration-200"
                  aria-label="Get directions to Jerry's Warehouse on Google Maps (opens in new tab)"
                >
                  <Navigation size={15} aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
