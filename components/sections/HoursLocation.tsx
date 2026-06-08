"use client";

import { useEffect, useRef } from "react";
import { Clock, MapPin, Phone, Navigation, ShoppingBag } from "lucide-react";
import { STORE_HOURS, STORE_INFO } from "@/lib/constants";

function getTodayIndex(): number {
  const d = new Date().getDay();
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
            const els = entry.target.querySelectorAll<HTMLElement>(".animate-on-scroll");
            els.forEach((el, i) => setTimeout(() => el.classList.add("in-view"), i * 150));
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
      className="py-24 lg:py-32 bg-[#ffffff]"
    >
      <div className="px-6 sm:px-8 lg:px-[150px]">
        {/* Section header */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

          {/* Map — left on desktop */}
          <div className="animate-on-scroll stagger-2 lg:order-1 flex flex-col gap-6">
            {/* Map embed */}
            <div className="w-full min-h-[420px] lg:min-h-[500px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2952.360337545654!2d-71.81030538793966!3d42.27083087108138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e38d405c98edaf%3A0x532fad0eab9785f1!2sJerry&#39;s%20Warehouse!5e0!3m2!1sen!2sus!4v1780863371163!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ minHeight: "420px", border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jerry's Warehouse on Google Maps"
              />
            </div>

            {/* Address + directions */}
            <div className="flex items-start justify-between gap-4">
              <address className="not-italic">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-[#c49335] flex-shrink-0" strokeWidth={1.5} />
                  <p className="font-semibold text-[#4a2c0a] text-base">{STORE_INFO.address.street}</p>
                </div>
                <p className="text-[#6e4218] text-base pl-6">
                  {STORE_INFO.address.city}, {STORE_INFO.address.state} {STORE_INFO.address.zip}
                </p>
              </address>
              <a
                href={STORE_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 shrink-0 py-2.5 px-5 bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded transition-colors duration-200"
                aria-label="Get directions on Google Maps"
              >
                <Navigation size={14} aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>

          {/* Hours — right on desktop */}
          <div className="animate-on-scroll stagger-1 lg:order-2">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="font-serif text-3xl font-bold text-[#4a2c0a]">Store Hours</h3>
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
                      className="border-b border-[#e8d8c0] last:border-0"
                      aria-current={isToday ? "date" : undefined}
                    >
                      <td className={`py-4 text-base font-medium ${isToday ? "text-[#c49335] font-semibold" : "text-[#4a2c0a]"}`}>
                        <span className="flex items-center gap-2">
                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c49335] flex-shrink-0" aria-hidden="true" />
                          )}
                          {row.day}
                          {isToday && (
                            <span className="text-xs bg-[#c49335]/15 text-[#c49335] px-1.5 py-0.5 rounded font-medium">
                              Today
                            </span>
                          )}
                        </span>
                      </td>
                      <td className={`py-4 text-base text-right font-mono ${row.closed ? "text-[#9a6840] italic" : isToday ? "text-[#c49335] font-semibold" : "text-[#6e4218]"}`}>
                        {row.closed ? "Closed" : `${row.open} – ${row.close}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Contact */}
            <div className="mt-8 pt-8 border-t border-[#e8d8c0] space-y-4">
              <a
                href={`tel:${STORE_INFO.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-[#6e4218] hover:text-[#c49335] transition-colors duration-200 group"
                aria-label={`Call us at ${STORE_INFO.phone}`}
              >
                <Phone size={17} className="text-[#c49335]/60 group-hover:text-[#c49335] transition-colors flex-shrink-0" strokeWidth={1.5} />
                <span className="text-base">{STORE_INFO.phone}</span>
              </a>
              <a
                href="https://www.ebay.com/usr/miso_242497?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=vrnrm_g4r4u&sssrc=4623447&ssuid=vrnrm_g4r4u&stype=1&widget_ver=artemis&media=COPY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#6e4218] hover:text-[#c49335] transition-colors duration-200 group"
                aria-label="Visit Jerry's Warehouse on eBay"
              >
                <ShoppingBag size={17} className="text-[#c49335]/60 group-hover:text-[#c49335] transition-colors flex-shrink-0" strokeWidth={1.5} />
                <span className="text-base">Shop us on eBay</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
