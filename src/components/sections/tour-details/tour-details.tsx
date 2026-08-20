import React, { useEffect, useState } from "react";
import {
  MapPin, Star, Users, Clock, Globe, Wifi, Utensils, Car, Dumbbell,
  Waves, BedDouble, ConciergeBell, Plane, CheckCircle2, XCircle,
  Calendar, ChevronLeft, ChevronRight, Share2, Heart, Info,
  AlertCircle, Loader2, Navigation, Phone, ExternalLink,
} from "lucide-react";
import SerpAPI, { SerpHotelDetail } from "../../../services/serpApi";

interface TourDetailsProps {
  tourName?: string;
  location?: string;
}

/* ── Amenity → Lucide icon map ──────────────────────────────────────── */
const amenityIcon = (name: string): React.ReactNode => {
  const n = name.toLowerCase();
  if (n.includes("wifi") || n.includes("wi-fi") || n.includes("internet")) return <Wifi size={16} />;
  if (n.includes("pool") || n.includes("swim")) return <Waves size={16} />;
  if (n.includes("gym") || n.includes("fitness")) return <Dumbbell size={16} />;
  if (n.includes("restaurant") || n.includes("breakfast") || n.includes("food") || n.includes("dining")) return <Utensils size={16} />;
  if (n.includes("parking") || n.includes("car")) return <Car size={16} />;
  if (n.includes("airport") || n.includes("transfer") || n.includes("shuttle")) return <Plane size={16} />;
  if (n.includes("room service") || n.includes("concierge")) return <ConciergeBell size={16} />;
  if (n.includes("spa") || n.includes("massage") || n.includes("wellness")) return <Star size={16} />;
  return <BedDouble size={16} />;
};

/* ── Star row ────────────────────────────────────────────────────────── */
const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <span style={{ display: "inline-flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= Math.round(rating) ? "currentColor" : "none"}
        style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
      />
    ))}
  </span>
);

/* ── Skeleton loader ────────────────────────────────────────────────── */
const TourDetailSkeleton: React.FC = () => (
  <div style={{ padding: "24px 0" }}>
    <div style={{ background: "#f3f4f6", borderRadius: 12, height: 420, marginBottom: 24, animation: "pulse 1.5s infinite" }} />
    <div style={{ height: 32, background: "#f3f4f6", borderRadius: 6, width: "60%", marginBottom: 12, animation: "pulse 1.5s infinite" }} />
    <div style={{ height: 20, background: "#f3f4f6", borderRadius: 6, width: "40%", marginBottom: 24, animation: "pulse 1.5s infinite" }} />
    {[1, 2, 3].map(i => (
      <div key={i} style={{ height: 16, background: "#f3f4f6", borderRadius: 6, marginBottom: 10, animation: "pulse 1.5s infinite" }} />
    ))}
  </div>
);

const TourDetails: React.FC<TourDetailsProps> = ({
  tourName = "Tour Details",
  location = "India",
}) => {
  const [hotel, setHotel] = useState<SerpHotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setHotel(null);
    setActiveImg(0);

    SerpAPI.searchHotelByName(tourName, location)
      .then((data) => {
        if (!mounted) return;
        const detail = SerpAPI.extractHotelDetail(data, tourName);
        if (detail) {
          setHotel(detail);
        } else {
          setError("No detailed data found for this hotel.");
        }
      })
      .catch(() => {
        if (mounted) setError("Failed to load hotel details.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [tourName, location]);

  const images = hotel?.images || [];
  const mapsUrl = hotel?.gps_coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${hotel.gps_coordinates.latitude},${hotel.gps_coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tourName)}`;

  return (
    <>
      {/* tp-tour-details-area-start */}
      <div className="tp-tour-details-area pt-10 pb-40">
        <div className="container container-1350">
          {loading && <TourDetailSkeleton />}

          {error && !loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", color: "#ef4444" }}>
              <AlertCircle size={22} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && hotel && (
            <>
              {/* ── Title + meta bar ───────────────────────────────────── */}
              <div className="row gx-25">
                <div className="col-12">
                  <div className="tp-tour-details">

                    {/* Title */}
                    <h2 className="tp-breadcrumb-title text-black mb-10" style={{ fontSize: "clamp(20px,3vw,28px)", lineHeight: 1.3 }}>
                      {hotel.name}
                    </h2>

                    {/* Meta chips */}
                    <div className="tp-tour-details-meta mb-15" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                      {hotel.type && (
                        <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 20, padding: "3px 12px", fontSize: 13, fontWeight: 500 }}>
                          {hotel.type}
                        </span>
                      )}
                      {(hotel.languages || []).map((lang) => (
                        <span key={lang} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>
                          <Globe size={12} /> {lang}
                        </span>
                      ))}
                      {hotel.duration && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>
                          <Clock size={12} /> {hotel.duration}
                        </span>
                      )}
                      {hotel.groupSize && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>
                          <Users size={12} /> {hotel.groupSize}
                        </span>
                      )}
                    </div>

                    {/* Rating + actions row */}
                    <div className="tp-tour-details-price-wrap mb-30 d-flex align-items-center flex-wrap gap-2 justify-content-between">
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        {/* Location */}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 14 }}>
                          <MapPin size={15} style={{ color: "#ef4444" }} /> {location}
                        </span>
                        {/* Stars + reviews */}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <StarRow rating={hotel.rating} />
                          <span style={{ color: "#6b7280", fontSize: 13 }}>({hotel.reviews} reviews)</span>
                        </span>
                      </div>

                      {/* Share / Wishlist */}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}
                          onClick={() => navigator.share?.({ title: hotel.name, url: hotel.link || window.location.href }).catch(() => {})}
                        >
                          <Share2 size={15} /> Share
                        </button>
                        <button
                          onClick={() => setWishlist((w) => !w)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: wishlist ? "#fff0f0" : "#fff", fontSize: 13, cursor: "pointer", color: wishlist ? "#ef4444" : "#374151" }}
                        >
                          <Heart size={15} fill={wishlist ? "currentColor" : "none"} /> {wishlist ? "Saved" : "Wishlist"}
                        </button>
                      </div>
                    </div>

                    {/* ── Gallery ──────────────────────────────────────── */}
                    {images.length > 0 && (
                      <div style={{ marginBottom: 30 }}>
                        {/* Main image */}
                        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", height: 420, background: "#f3f4f6", marginBottom: 10 }}>
                          <img
                            src={images[activeImg]}
                            alt={hotel.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }}
                          />
                          {/* Prev / Next */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={() => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1))}
                                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 38, height: 38, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              ><ChevronLeft size={20} /></button>
                              <button
                                onClick={() => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1))}
                                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 38, height: 38, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              ><ChevronRight size={20} /></button>
                            </>
                          )}
                          {/* Image counter */}
                          <span style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 12, borderRadius: 20, padding: "3px 10px" }}>
                            {activeImg + 1} / {images.length}
                          </span>
                          {/* Map link overlay */}
                          <a
                            href={mapsUrl} target="_blank" rel="noreferrer"
                            style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 12, borderRadius: 20, padding: "5px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}
                          >
                            <Navigation size={12} /> View on Map
                          </a>
                        </div>
                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                            {images.slice(0, 8).map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => setActiveImg(idx)}
                                style={{ flexShrink: 0, width: 80, height: 60, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: idx === activeImg ? "2px solid #2563eb" : "2px solid transparent", opacity: idx === activeImg ? 1 : 0.65, transition: "all 0.2s" }}
                              >
                                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Main 2-col layout ────────────────────────────── */}
                    <div className="row gx-25">

                      {/* LEFT: content */}
                      <div className="col-lg-7">

                        {/* Description */}
                        {hotel.description && (
                          <div style={{ marginBottom: 30 }}>
                            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 15 }}>{hotel.description}</p>
                          </div>
                        )}

                        {/* Quick info cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
                          {[
                            { icon: <Clock size={18} />, label: "Duration", value: hotel.duration || "2N/3D" },
                            { icon: <Users size={18} />, label: "Group size", value: hotel.groupSize || "1–8" },
                            { icon: <BedDouble size={18} />, label: "Check-in", value: hotel.check_in_time || "12:00 PM" },
                            { icon: <BedDouble size={18} />, label: "Check-out", value: hotel.check_out_time || "11:00 AM" },
                          ].map(({ icon, label, value }) => (
                            <div key={label} style={{ padding: "14px 16px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fafafa" }}>
                              <span style={{ color: "#2563eb", marginBottom: 6, display: "block" }}>{icon}</span>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{label}</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Amenities */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Amenities</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {hotel.amenities.map((a) => (
                                <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f0f7ff", borderRadius: 20, fontSize: 13, color: "#1e40af", border: "1px solid #dbeafe" }}>
                                  {amenityIcon(a)} {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Highlights */}
                        {hotel.highlights && hotel.highlights.length > 0 && (
                          <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Highlights</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                              {hotel.highlights.map((h) => (
                                <li key={h} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                                  <CheckCircle2 size={16} style={{ color: "#22c55e", flexShrink: 0 }} /> {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Includes / Excludes */}
                        <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#111827" }}>What's included</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Included</div>
                              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                {(hotel.included || []).map((item) => (
                                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" }}>
                                    <CheckCircle2 size={15} style={{ color: "#22c55e", flexShrink: 0 }} /> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Not included</div>
                              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                {(hotel.excluded || []).map((item) => (
                                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" }}>
                                    <XCircle size={15} style={{ color: "#ef4444", flexShrink: 0 }} /> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Cancellation policy */}
                        {hotel.cancellation && (
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, marginBottom: 32 }}>
                            <Info size={18} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <div style={{ fontWeight: 600, color: "#15803d", marginBottom: 2, fontSize: 14 }}>Cancellation Policy</div>
                              <div style={{ color: "#166534", fontSize: 13 }}>{hotel.cancellation}</div>
                            </div>
                          </div>
                        )}

                        {/* Nearby places */}
                        {hotel.nearby_places && hotel.nearby_places.length > 0 && (
                          <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Nearby Places</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {hotel.nearby_places.slice(0, 5).map((np) => (
                                <div key={np.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: 14 }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#374151", fontWeight: 500 }}>
                                    <MapPin size={14} style={{ color: "#ef4444" }} /> {np.name}
                                  </span>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    {(np.transportations || []).map((t) => (
                                      <span key={t.type} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", borderRadius: 12, padding: "2px 8px" }}>
                                        {t.type} · {t.duration}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Map iframe */}
                        <div style={{ marginBottom: 32 }}>
                          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Meeting Point</h3>
                          <div style={{ borderRadius: 12, overflow: "hidden", height: 260 }}>
                            <iframe
                              title={`Map: ${hotel.name}`}
                              src={
                                hotel.gps_coordinates
                                  ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${hotel.gps_coordinates.latitude},${hotel.gps_coordinates.longitude}`
                                  : `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${encodeURIComponent(hotel.name)}`
                              }
                              width="100%"
                              height="260"
                              style={{ border: 0, display: "block" }}
                              allowFullScreen={true}
                              loading="lazy"
                            />
                          </div>
                          {/* Fallback map link */}
                          <a
                            href={mapsUrl} target="_blank" rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "#2563eb" }}
                          >
                            <Navigation size={13} /> Open in Google Maps
                          </a>
                        </div>
                      </div>

                      {/* RIGHT: booking sidebar */}
                      <div className="col-lg-5">
                        <div style={{ position: "sticky", top: 90 }}>
                          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 24px", background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                            {/* Price */}
                            <div style={{ marginBottom: 22 }}>
                              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>From</div>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                {hotel.originalPrice && (
                                  <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through" }}>
                                    ₹{hotel.originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                                <span style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>{hotel.price}</span>
                              </div>
                              <div style={{ fontSize: 12, color: "#6b7280" }}>per night / 2 adults</div>
                            </div>

                            {/* Star rating */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
                              <StarRow rating={hotel.rating} size={16} />
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{hotel.rating.toFixed(1)}</span>
                              <span style={{ fontSize: 13, color: "#6b7280" }}>({hotel.reviews} reviews)</span>
                            </div>

                            {/* Quick facts */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                                <Calendar size={16} style={{ color: "#2563eb" }} />
                                <span style={{ color: "#6b7280" }}>Check-in:</span>
                                <span style={{ fontWeight: 600 }}>{hotel.check_in_time}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                                <Calendar size={16} style={{ color: "#2563eb" }} />
                                <span style={{ color: "#6b7280" }}>Check-out:</span>
                                <span style={{ fontWeight: 600 }}>{hotel.check_out_time}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                                <MapPin size={16} style={{ color: "#ef4444" }} />
                                <span style={{ color: "#6b7280" }}>Location:</span>
                                <span style={{ fontWeight: 600 }}>{location}</span>
                              </div>
                            </div>

                            {/* Book CTA */}
                            <a
                              href={hotel.link || mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="tp-btn w-100 text-center d-block"
                              style={{ padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, marginBottom: 12, textDecoration: "none" }}
                            >
                              Book Now
                            </a>
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, color: "#374151", textDecoration: "none" }}
                            >
                              <Navigation size={15} /> View on Maps
                            </a>

                            {/* Contact */}
                            {hotel.website && (
                              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                                <a
                                  href={hotel.website} target="_blank" rel="noreferrer"
                                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}
                                >
                                  <ExternalLink size={13} /> Official website
                                </a>
                              </div>
                            )}

                            {/* Cancellation notice */}
                            <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                              <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }} />
                              <span style={{ fontSize: 12, color: "#166534" }}>{hotel.cancellation || "Free cancellation available"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* tp-tour-details-area-end */}
    </>
  );
};

export default TourDetails;
