import React from "react";

interface LinkItem {
  label: string;
  url: string;
}

interface DirectorySection {
  title: string;
  links: LinkItem[];
}

const DIRECTORY_DATA: DirectorySection[] = [
  {
    title: "Discovery Convoy",
    links: [
      { label: "About Us", url: "/about" },
      { label: "Investor Relations", url: "#" },
      { label: "Careers", url: "#" },
      { label: "Sustainability", url: "#" },
      { label: "MMT Foundation", url: "#" },
      { label: "Legal Notices", url: "#" },
      { label: "CSR Policy & Committee", url: "#" },
      { label: "myBiz for Corporate Travel", url: "#" },
      { label: "myPartner - Travel Agent Portal", url: "#" },
      { label: "List your hotel", url: "#" },
      { label: "Partners- Redbus", url: "#" },
      { label: "Partners- Goibibo", url: "#" },
      { label: "Advertise with Us", url: "#" },
      { label: "Holiday-Franchise", url: "#" },
      { label: "Partners- BookMyForex", url: "#" },
      { label: "RedBus Ferry Malaysia", url: "#" },
      { label: "RedBus Ferry Singapore", url: "#" },
      { label: "redBus Vietnam", url: "#" },
      { label: "redBus Cambodia", url: "#" },
      { label: "redBus Columbia", url: "#" },
      { label: "redBus Peru", url: "#" },
      { label: "redBus Indonesia", url: "#" },
      { label: "Things to Do in Malaysia", url: "#" },
      { label: "Things to Do in Singapore", url: "#" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Delhi Chennai Flights", url: "/flights" },
      { label: "Delhi Mumbai Flights", url: "/flights" },
      { label: "Delhi Goa Flights", url: "/flights" },
      { label: "Chennai Mumbai flights", url: "/flights" },
      { label: "Mumbai Hyderabad flights", url: "/flights" },
      { label: "Kolkata to Rupsi Flights", url: "/flights" },
      { label: "Rupsi to Guwahati Flights", url: "/flights" },
      { label: "Pasighat to Guwahati Flights", url: "/flights" },
      { label: "Delhi to Khajuraho Flights", url: "/flights" },
      { label: "Cochin to Agatti Island Flights", url: "/flights" },
      { label: "Hotels in Delhi", url: "/destination/delhi" },
      { label: "Hotels in Mumbai", url: "/destination/mumbai" },
      { label: "Hotels In Goa", url: "/destination/goa" },
      { label: "Hotels In Jaipur", url: "/destination/jaipur" },
      { label: "Hotels In Ooty", url: "/destination/ooty" },
      { label: "Hotels In Udaipur", url: "/destination/udaipur" },
      { label: "Hotels in Puri", url: "/destination/puri" },
      { label: "Hotels In North Goa", url: "/destination/goa" },
      { label: "Hotels In Rishikesh", url: "/destination/rishikesh" },
      { label: "Honeymoon Packages", url: "/packages/honeymoon" },
      { label: "Kerala Packages", url: "/destination/kerala" },
      { label: "Kashmir Packages", url: "/destination/kashmir" },
      { label: "Ladakh Packages", url: "/destination/ladakh" },
      { label: "Goa Packages", url: "/destination/goa" },
      { label: "Thailand Packages", url: "/destination/thailand" },
      { label: "Sri Lanka Visa", url: "#" },
      { label: "Thailand Visa", url: "#" },
      { label: "Explore Goa", url: "/destination/goa" },
      { label: "Explore Manali", url: "/destination/manali" },
      { label: "Explore Shimla", url: "/destination/shimla" },
      { label: "Explore Jaipur", url: "/destination/jaipur" },
      { label: "Explore Srinagar", url: "/destination/srinagar" },
    ],
  },
  {
    title: "About the Site",
    links: [
      { label: "Customer Support", url: "/contact" },
      { label: "Payment Security", url: "#" },
      { label: "Privacy Policy", url: "#" },
      { label: "Cookie Policy", url: "#" },
      { label: "User Agreement", url: "#" },
      { label: "Terms of Service", url: "#" },
      { label: "Franchise Offices", url: "#" },
      { label: "Make A Payment", url: "#" },
      { label: "Work From Home", url: "#" },
      { label: "Escalation Channel", url: "#" },
      { label: "Report Security Issues", url: "#" },
    ],
  },
  {
    title: "Popular Routes",
    links: [
      { label: "Delhi to Goa flight", url: "/flights" },
      { label: "Delhi to Mumbai flight", url: "/flights" },
      { label: "Mumbai to Delhi flight", url: "/flights" },
      { label: "Delhi to Patna flight", url: "/flights" },
      { label: "Mumbai to Goa flight", url: "/flights" },
      { label: "Bangalore to Delhi flight", url: "/flights" },
      { label: "Delhi to Bangalore flight", url: "/flights" },
      { label: "Pune to Delhi flight", url: "/flights" },
      { label: "Patna to Delhi flight", url: "/flights" },
      { label: "Delhi to Kolkata flight", url: "/flights" },
      { label: "Kolkata to Delhi flight", url: "/flights" },
      { label: "Bangalore to Goa flight", url: "/flights" },
      { label: "Hyderabad to Delhi flight", url: "/flights" },
      { label: "Mumbai to Kolkata flight", url: "/flights" },
      { label: "Delhi to Pune flight", url: "/flights" },
      { label: "Delhi to Srinagar flight", url: "/flights" },
      { label: "Mumbai to Bangalore flight", url: "/flights" },
      { label: "Ahmedabad to Goa flight", url: "/flights" },
      { label: "Bangalore to Mumbai flight", url: "/flights" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "Cheap Flights", url: "/flights" },
      { label: "Flight Status", url: "/flights" },
      { label: "Kumbh Mela", url: "#" },
      { label: "Domestic Airlines", url: "/flights" },
      { label: "International Airlines", url: "/flights" },
      { label: "Indigo", url: "/flights" },
      { label: "Spicejet", url: "/flights" },
      { label: "Air Asia", url: "/flights" },
      { label: "Air India", url: "/flights" },
      { label: "Indian Railways", url: "#" },
      { label: "Trip Ideas", url: "/blog" },
      { label: "Beaches", url: "/destination/goa" },
      { label: "Honeymoon Destinations", url: "/packages/honeymoon" },
      { label: "Romantic Destinations", url: "/destination/paris" },
      { label: "Popular Destinations", url: "/destinations" },
      { label: "Resorts In Udaipur", url: "/destination/udaipur" },
      { label: "Resorts In Munnar", url: "/destination/munnar" },
      { label: "Villas In Lonavala", url: "/destination/lonavala" },
      { label: "Hotels in Thailand", url: "/destination/thailand" },
      { label: "Villas In Goa", url: "/destination/goa" },
      { label: "Domestic Flight Offers", url: "/flights" },
      { label: "International Flight Offers", url: "/flights" },
      { label: "UAE Flight Offers", url: "/flights" },
      { label: "USA", url: "/destination/usa" },
      { label: "UAE", url: "/destination/dubai" },
      { label: "Saudi Arabia", url: "/destination/saudi-arabia" },
      { label: "UK", url: "/destination/london" },
      { label: "Oman", url: "/destination/oman" },
    ],
  },
  {
    title: "Corporate Travel",
    links: [
      { label: "Business Travel", url: "#" },
      { label: "Corporate Travel", url: "#" },
      { label: "Corporate Travel Management", url: "#" },
      { label: "Corporate Travel Solution", url: "#" },
      { label: "Corporate Hotel Booking", url: "#" },
      { label: "Corporate Flight Booking", url: "#" },
      { label: "Expense Management", url: "#" },
      { label: "Corporate Expense Management", url: "#" },
      { label: "GST on Hotel Rooms", url: "#" },
      { label: "GST on Flight Tickets", url: "#" },
      { label: "Business Travel for SME", url: "#" },
      { label: "GST Invoice for International flights", url: "#" },
      { label: "GST Invoice for Bus", url: "#" },
      { label: "GST on Train Tickets", url: "#" },
      { label: "T&E (Travel & Expense)", url: "#" },
      { label: "myBiz - Best Business Travel Platform", url: "#" },
      { label: "GST Invoice for Corporate Travel", url: "#" },
      { label: "myBiz for Small Business", url: "#" },
      { label: "Free cancellation on International Flights", url: "#" },
    ],
  },
  {
    title: "Product Offering",
    links: [
      { label: "Flights", url: "/flights" },
      { label: "International Flights", url: "/flights/international" },
      { label: "Charter Flights", url: "/flights" },
      { label: "Hotels", url: "/luxury" },
      { label: "International Hotels", url: "/luxury" },
      { label: "Apply Visa Online", url: "#" },
      { label: "Homestays and Villas", url: "/luxury" },
      { label: "Activities", url: "#" },
      { label: "Holidays In India", url: "/domestic" },
      { label: "International Holidays", url: "/international" },
      { label: "Book Hotels From UAE", url: "/luxury" },
      { label: "Book Online Cabs", url: "#" },
      { label: "Book Bus Tickets", url: "#" },
      { label: "Book Train Tickets", url: "#" },
      { label: "Cheap Tickets to India", url: "/flights" },
      { label: "Book Flights From US", url: "/flights" },
      { label: "Book Flights From UAE", url: "/flights" },
      { label: "Trip Planner", url: "#" },
      { label: "Forex Card", url: "#" },
      { label: "Buy Foreign Currency", url: "#" },
      { label: "Travel Insurance", url: "#" },
      { label: "Travel Insurance Thailand", url: "#" },
      { label: "Travel Insurance For UAE", url: "#" },
      { label: "Travel Insurance For Indonesia", url: "#" },
      { label: "Travel Insurance For Vietnam", url: "#" },
      { label: "Travel Insurance For Europe", url: "#" },
      { label: "Travel Insurance For USA", url: "#" },
      { label: "Travel Insurance for Singapore", url: "#" },
      { label: "Travel Insurance for Malaysia", url: "#" },
      { label: "Travel Insurance for Sri Lanka", url: "#" },
      { label: "Travel Insurance for United Kingdom", url: "#" },
      { label: "Travel Insurance for Canada", url: "#" },
      { label: "Gift Cards", url: "#" },
      { label: "Trip Ideas", url: "/blog" },
      { label: "Travel Blog", url: "/blog" },
      { label: "PNR Status", url: "#" },
      { label: "Advertising Solutions", url: "#" },
      { label: "One Way Cab", url: "#" },
      { label: "Travel Credit Card", url: "#" },
    ],
  },
  {
    title: "Top Hotels in India",
    links: [
      { label: "Fairmont Jaipur", url: "/tour/Fairmont%20Jaipur?loc=Jaipur" },
      { label: "St Regis Goa", url: "/tour/The%20St%20Regis%20Goa%20Resort?loc=Goa" },
      { label: "Six Senses Fort Barwara", url: "/tour/Six%20Senses%20Fort%20Barwara?loc=Rajasthan" },
      { label: "W Goa", url: "/tour/W%20Goa?loc=Goa" },
      { label: "Grand Hyatt Goa", url: "/tour/Grand%20Hyatt%20Goa?loc=Goa" },
      { label: "Shangri-La Bangalore", url: "/tour/Shangri-La%20Bengaluru?loc=Bangalore" },
      { label: "The St Regis Mumbai", url: "/tour/The%20St%20Regis%20Mumbai?loc=Mumbai" },
      { label: "Taj Rishikesh", url: "/tour/Taj%20Rishikesh%20Resort%20Spa?loc=Rishikesh" },
      { label: "Grand Hyatt Mumbai", url: "/tour/Grand%20Hyatt%20Mumbai?loc=Mumbai" },
      { label: "Le Meridien Delhi", url: "/tour/Le%20Meridien%20New%20Delhi?loc=Delhi" },
      { label: "Rambagh Palace Jaipur", url: "/tour/Rambagh%20Palace?loc=Jaipur" },
      { label: "Leela Palace Chennai", url: "/tour/The%20Leela%20Palace%20Chennai?loc=Chennai" },
      { label: "The Leela Palace Udaipur", url: "/tour/The%20Leela%20Palace%20Udaipur?loc=Udaipur" },
      { label: "Taj Lake Palace Udaipur", url: "/tour/Taj%20Lake%20Palace?loc=Udaipur" },
      { label: "Jw Marriott Chandigarh", url: "/tour/JW%20Marriott%20Hotel%20Chandigarh?loc=Chandigarh" },
      { label: "Alila Diwa Goa", url: "/tour/Alila%20Diwa%20Goa?loc=Goa" },
      { label: "Le Meridien Goa", url: "/tour/Le%20Meridien%20Goa%20Calangute?loc=Goa" },
      { label: "Taj Lands End Mumbai", url: "/tour/Taj%20Lands%20End%20Mumbai?loc=Mumbai" },
      { label: "Itc Grand Chola Chennai", url: "/tour/ITC%20Grand%20Chola%20Chennai?loc=Chennai" },
      { label: "Itc Maratha Mumbai", url: "/tour/ITC%20Maratha%20Mumbai?loc=Mumbai" },
      { label: "Oberoi Udaivilas", url: "/tour/The%20Oberoi%20Udaivilas?loc=Udaipur" },
      { label: "Jai Mahal Palace Jaipur", url: "/tour/Jai%20Mahal%20Palace%20Jaipur?loc=Jaipur" },
      { label: "Taj Mahal Tower Mumbai", url: "/tour/Taj%20Mahal%20Tower%20Mumbai?loc=Mumbai" },
      { label: "Marriott Suites Pune", url: "/tour/Marriott%20Suites%20Pune?loc=Pune" },
      { label: "Park Hyatt Chennai", url: "/tour/Park%20Hyatt%20Chennai?loc=Chennai" },
      { label: "The Leela Palace Jaipur", url: "/tour/The%20Leela%20Palace%20Jaipur?loc=Jaipur" },
      { label: "Jw Marriott Mumbai Sahar", url: "/tour/JW%20Marriott%20Mumbai%20Sahar?loc=Mumbai" },
      { label: "Jw Marriott Mumbai Juhu", url: "/tour/JW%20Marriott%20Mumbai%20Juhu?loc=Mumbai" },
      { label: "The Ritz Carlton Bengaluru", url: "/tour/The%20Ritz-Carlton%20Bangalore?loc=Bangalore" },
      { label: "The Oberoi New Delhi", url: "/tour/The%20Oberoi%20New%20Delhi?loc=Delhi" },
      { label: "Taj Resort & Convention Centre Goa", url: "/tour/Taj%20Resort%20and%20Convention%20Center%20Goa?loc=Goa" },
      { label: "Taj Bengal Kolkata", url: "/tour/Taj%20Bengal%20Kolkata?loc=Kolkata" },
      { label: "Taj Coromandel Chennai", url: "/tour/Taj%20Coromandel%20Chennai?loc=Chennai" },
      { label: "The Oberoi Gurgaon", url: "/tour/The%20Oberoi%20Gurgaon?loc=Gurgaon" },
      { label: "The Westin Goa", url: "/tour/The%20Westin%20Goa?loc=Goa" },
      { label: "Jw Marriott Hotel Pune", url: "/tour/JW%20Marriott%20Hotel%20Pune?loc=Pune" },
      { label: "The Leela Palace New Delhi", url: "/tour/The%20Leela%20Palace%20New%20Delhi?loc=Delhi" },
      { label: "Taj West End Bengaluru", url: "/tour/Taj%20West%20End%20Bengaluru?loc=Bangalore" },
      { label: "The Taj Mahal Palace Mumbai", url: "/tour/The%20Taj%20Mahal%20Palace%20Mumbai?loc=Mumbai" },
      { label: "Best Hotels in India", url: "/luxury" },
    ],
  },
  {
    title: "International Routes",
    links: [
      { label: "Delhi to Dubai flight", url: "/flights" },
      { label: "Mumbai to Dubai Flight", url: "/flights" },
      { label: "Ahmedabad to London flight", url: "/flights" },
      { label: "Delhi to Bali flight", url: "/flights" },
      { label: "Delhi to London flight", url: "/flights" },
      { label: "Delhi to Bangkok flight", url: "/flights" },
      { label: "Delhi to kathmandu flight", url: "/flights" },
      { label: "Delhi to Singapore flight", url: "/flights" },
      { label: "Mumbai to London flight", url: "/flights" },
      { label: "Mumbai to Bali flight", url: "/flights" },
      { label: "Mumbai to Bangkok flight", url: "/flights" },
      { label: "Ahmedabad to Dubai Flight", url: "/flights" },
      { label: "Bangalore to Dubai flight", url: "/flights" },
      { label: "Chennai to Dubai flight", url: "/flights" },
      { label: "Delhi to Phuket flight", url: "/flights" },
    ],
  },
  {
    title: "Popular Domestic routes",
    links: [
      { label: "Delhi to Chennai flight", url: "/flights" },
      { label: "Kolkata to Bangalore flight", url: "/flights" },
      { label: "Delhi to Hyderabad flight", url: "/flights" },
      { label: "Delhi to Ahmedabad flight", url: "/flights" },
      { label: "Kolkata to Bagdogra flight", url: "/flights" },
      { label: "Srinagar to Delhi flight", url: "/flights" },
      { label: "Hyderabad to Goa flight", url: "/flights" },
      { label: "Mumbai to Chennai flight", url: "/flights" },
      { label: "Ahmedabad to Mumbai flight", url: "/flights" },
      { label: "Delhi to Bagdogra flight", url: "/flights" },
      { label: "Goa to Delhi flight", url: "/flights" },
      { label: "Goa to Mumbai flight", url: "/flights" },
      { label: "Hyderabad to Bangalore flight", url: "/flights" },
      { label: "Mumbai to Hyderabad flight", url: "/flights" },
      { label: "Delhi to Leh flight", url: "/flights" },
      { label: "Pune to Bangalore flight", url: "/flights" },
      { label: "Kolkata to Goa flight", url: "/flights" },
      { label: "Bangalore to Pune flight", url: "/flights" },
      { label: "Hyderabad to Mumbai flight", url: "/flights" },
    ],
  },
  {
    title: "Top International hotels",
    links: [
      { label: "Adaaran Club Rannalhi", url: "/tour/Adaaran%20Club%20Rannalhi?loc=Maldives" },
      { label: "Marina Bay Sands Singapore", url: "/tour/Marina%20Bay%20Sands%20Singapore?loc=Singapore" },
      { label: "Coco Bodu Hithi", url: "/tour/Coco%20Bodu%20Hithi?loc=Maldives" },
      { label: "Taj Dubai", url: "/tour/Taj%20Dubai?loc=Dubai" },
      { label: "Atlantis Hotel Dubai", url: "/tour/Atlantis%20The%20Palm%20Dubai?loc=Dubai" },
      { label: "Amari Phuket", url: "/tour/Amari%20Phuket?loc=Phuket" },
      { label: "Jw Marriott Dubai", url: "/tour/JW%20Marriott%20Marquis%20Hotel%20Dubai?loc=Dubai" },
      { label: "Armani Hotel Dubai", url: "/tour/Armani%20Hotel%20Dubai?loc=Dubai" },
      { label: "Grand Hyatt Dubai", url: "/tour/Grand%20Hyatt%20Dubai?loc=Dubai" },
      { label: "Saii Lagoon Maldives", url: "/tour/SAii%20Lagoon%20Maldives?loc=Maldives" },
      { label: "Gevora Hotel Dubai", url: "/tour/Gevora%20Hotel%20Dubai?loc=Dubai" },
      { label: "Hyatt Regency Dubai", url: "/tour/Hyatt%20Regency%20Dubai?loc=Dubai" },
      { label: "Pan Pacific Singapore", url: "/tour/Pan%20Pacific%20Singapore?loc=Singapore" },
      { label: "The Palm Dubai", url: "/tour/Atlantis%20The%20Palm%20Dubai?loc=Dubai" },
      { label: "Caesars Palace", url: "/tour/Caesars%20Palace%20Las%20Vegas?loc=Las%20Vegas" },
      { label: "Baiyoke Sky Hotel", url: "/tour/Baiyoke%20Sky%20Hotel?loc=Bangkok" },
      { label: "Centara Pattaya Hotel", url: "/tour/Centara%20Pattaya%20Hotel?loc=Pattaya" },
      { label: "Embudu Village", url: "/tour/Embudu%20Village%20Maldives?loc=Maldives" },
      { label: "Orchard Hotel Singapore", url: "/tour/Orchard%20Hotel%20Singapore?loc=Singapore" },
      { label: "Reethi Beach Resort", url: "/tour/Reethi%20Beach%20Resort%20Maldives?loc=Maldives" },
      { label: "Ambassador Hotel Bangkok", url: "/tour/Ambassador%20Hotel%20Bangkok?loc=Bangkok" },
      { label: "Dusit Thani Pattaya", url: "/tour/Dusit%20Thani%20Pattaya?loc=Pattaya" },
      { label: "Shangri La Singapore", url: "/tour/Shangri-La%20Singapore?loc=Singapore" },
      { label: "Sunbeam Hotel Pattaya", url: "/tour/Sunbeam%20Hotel%20Pattaya?loc=Pattaya" },
      { label: "Taj Samudra Colombo", url: "/tour/Taj%20Samudra%20Colombo?loc=Colombo" },
      { label: "Bangkok Palace Hotel", url: "/tour/Bangkok%20Palace%20Hotel?loc=Bangkok" },
      { label: "Hilton Pattaya", url: "/tour/Hilton%20Pattaya?loc=Pattaya" },
      { label: "Novotel Phuket Resort", url: "/tour/Novotel%20Phuket%20Resort?loc=Phuket" },
      { label: "Taj Exotica Resort Maldives", url: "/tour/Taj%20Exotica%20Resort%20and%20Spa%20Maldives?loc=Maldives" },
      { label: "Village Hotel Bugis", url: "/tour/Village%20Hotel%20Bugis?loc=Singapore" },
      { label: "Avani Atrium Bangkok", url: "/tour/Avani%20Atrium%20Bangkok?loc=Bangkok" },
      { label: "The Plaza New York", url: "/tour/The%20Plaza%20Hotel%20New%20York?loc=New%20York" },
      { label: "Village Hotel Albert Court", url: "/tour/Village%20Hotel%20Albert%20Court?loc=Singapore" },
      { label: "Amari Pattaya", url: "/tour/Amari%20Pattaya?loc=Pattaya" },
    ],
  },
  {
    title: "Visa Offerings",
    links: [
      { label: "Australia Visa", url: "#" },
      { label: "Austria Visa", url: "#" },
      { label: "Azerbaijan Visa", url: "#" },
      { label: "Bangladesh Visa", url: "#" },
      { label: "Bahrain Visa", url: "#" },
      { label: "Cambodia Visa", url: "#" },
      { label: "China Visa", url: "#" },
      { label: "Czech Republic Visa", url: "#" },
      { label: "Dubai - UAE Visa", url: "#" },
      { label: "Egypt Visa", url: "#" },
      { label: "Finland Visa", url: "#" },
      { label: "France Visa", url: "#" },
      { label: "Georgia Visa", url: "#" },
      { label: "Germany Visa", url: "#" },
      { label: "Greece Visa", url: "#" },
      { label: "Hong Kong Visa", url: "#" },
      { label: "Iceland Visa", url: "#" },
      { label: "Indonesia Visa", url: "#" },
      { label: "Ireland Visa", url: "#" },
      { label: "Italy Visa", url: "#" },
      { label: "Japan Visa", url: "#" },
      { label: "Kenya Visa", url: "#" },
      { label: "Malaysia Visa", url: "#" },
      { label: "Morocco Visa", url: "#" },
      { label: "Netherlands Visa", url: "#" },
      { label: "New Zealand Visa", url: "#" },
      { label: "Norway Visa", url: "#" },
      { label: "Portugal Visa", url: "#" },
      { label: "Qatar Visa", url: "#" },
      { label: "Russia Visa", url: "#" },
      { label: "Singapore Visa", url: "#" },
      { label: "South Africa Visa", url: "#" },
      { label: "South Korea Visa", url: "#" },
      { label: "Spain Visa", url: "#" },
      { label: "Sri Lanka Visa", url: "#" },
      { label: "Sweden Visa", url: "#" },
      { label: "Switzerland Visa", url: "#" },
      { label: "Thailand Visa", url: "#" },
      { label: "United Kingdom - UK Visa", url: "#" },
      { label: "Uzbekistan Visa", url: "#" },
      { label: "Vietnam Visa", url: "#" },
      { label: "Mongolia Visa", url: "#" },
      { label: "Zambia Visa", url: "#" },
    ],
  },
  {
    title: "Popular International Routes",
    links: [
      { label: "Hyderabad to Dubai flight", url: "/flights" },
      { label: "Chennai to Singapore flight", url: "/flights" },
      { label: "Mumbai to Singapore flight", url: "/flights" },
      { label: "Delhi to Toronto flight", url: "/flights" },
      { label: "Bangalore to Bangkok flight", url: "/flights" },
      { label: "Delhi to New York flight", url: "/flights" },
      { label: "Bangalore to Bali flight", url: "/flights" },
      { label: "Bangalore to Singapore flight", url: "/flights" },
      { label: "Delhi to Hong Kong flight", url: "/flights" },
      { label: "Delhi to Maldives flight", url: "/flights" },
      { label: "Delhi to Paris flight", url: "/flights" },
      { label: "Dubai to Delhi Flight", url: "/flights" },
      { label: "Kochi to Dubai Flight", url: "/flights" },
      { label: "Delhi to Tokyo flight", url: "/flights" },
      { label: "Dubai to Mumbai Flight", url: "/flights" },
      { label: "Mumbai to New York flight", url: "/flights" },
      { label: "Amritsar to Dubai Flight", url: "/flights" },
      { label: "Chennai to Colombo flight", url: "/flights" },
      { label: "Mumbai to Tokyo flight", url: "/flights" },
      { label: "Delhi to Colombo flight", url: "/flights" },
      { label: "Mumbai to Colombo flight", url: "/flights" },
      { label: "Delhi to Seoul flight", url: "/flights" },
      { label: "Flight Status", url: "/flights" },
    ],
  },
  {
    title: "Book Hotels in India from Top Destinations",
    links: [
      { label: "Hotels in Jaipur", url: "/destination/jaipur" },
      { label: "Hotels in Goa", url: "/destination/goa" },
      { label: "Hotels in Delhi", url: "/destination/delhi" },
      { label: "Hotels in Udaipur", url: "/destination/udaipur" },
      { label: "Hotels in Gurgaon", url: "/destination/gurgaon" },
      { label: "Hotels in Mumbai", url: "/destination/mumbai" },
      { label: "Hotels in Bangalore", url: "/destination/bangalore" },
      { label: "Hotels in Rishikesh", url: "/destination/rishikesh" },
      { label: "Hotels in Agra", url: "/destination/agra" },
      { label: "Hotels in Chennai", url: "/destination/chennai" },
      { label: "Hotels in Kasauli", url: "/destination/kasauli" },
      { label: "Hotels in Kolkata", url: "/destination/kolkata" },
      { label: "Hotels in Pune", url: "/destination/pune" },
      { label: "Hotels in Manali", url: "/destination/manali" },
      { label: "Hotels in Lonavala", url: "/destination/lonavala" },
      { label: "Hotels in Shimla", url: "/destination/shimla" },
      { label: "Hotels in Munnar", url: "/destination/munnar" },
      { label: "Hotels in Ayodhya", url: "/destination/ayodhya" },
      { label: "Hotels in Gulmarg", url: "/destination/gulmarg" },
      { label: "Hotels in Leh", url: "/destination/leh" },
      { label: "Hotels in Hyderabad", url: "/destination/hyderabad" },
    ],
  },
];

export const SeoDirectorySection: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url.startsWith("/")) {
      e.preventDefault();
      window.history.pushState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="tp-seo-directory-area py-5 bg-white border-top">
      <div className="container">
        {/* Directory Link Categories */}
        <div className="tp-seo-directory-grid mb-4">
          {DIRECTORY_DATA.map((sec, idx) => (
            <div key={idx} className="tp-seo-directory-col mb-4">
              <h4 className="tp-seo-directory-title">{sec.title}</h4>
              <div className="tp-seo-directory-links">
                {sec.links.map((link, lIdx) => (
                  <React.Fragment key={lIdx}>
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(e, link.url)}
                      className="tp-seo-link"
                    >
                      {link.label}
                    </a>
                    {lIdx < sec.links.length - 1 && <span className="tp-seo-sep">, </span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Editorial Content Blocks */}
        <div className="tp-seo-content-box pt-4 border-top">
          <div className="mb-3">
            <h5 className="tp-seo-heading">Why Discovery Convoy?</h5>
            <p className="tp-seo-text">
              Established as India's premier travel brand, Discovery Convoy has since positioned itself as one of the leading companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience to many of its customers. The experience of booking your flight tickets, hotel stay, and holiday package through our desktop site or mobile app can be done with complete ease and no hassles at all. We also deliver amazing offers, such as Instant Discounts, Fare Calendar, MyRewardsProgram, MyWallet, and many more while updating them from time to time to better suit our customers’ evolving needs and demands.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="tp-seo-heading">Booking Flights with Discovery Convoy</h5>
            <p className="tp-seo-text">
              At Discovery Convoy, you can find the best of deals and cheap air tickets to any place you want by booking your tickets on our website or app. Being India’s leading website for hotel, flight, and holiday bookings, Discovery Convoy helps you book flight tickets that are affordable and customized to your convenience. With customer satisfaction being our ultimate goal, we also have a 24/7 dedicated helpline to cater to our customer’s queries and concerns. Serving millions of happy travelers, we are glad to fulfill the dreams of folks who need a quick and easy means to find air tickets. You can get a hold of the cheapest flight of your choice today while also enjoying the other available options for your travel needs with us.
            </p>
          </div>

          <div>
            <h5 className="tp-seo-heading">Domestic Flights with Discovery Convoy</h5>
            <p className="tp-seo-text mb-0">
              Discovery Convoy is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price. Instant notifications ensure current flight status, instant fare drops, amazing discounts, instant refunds and rebook options, price comparisons and many more interesting features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoDirectorySection;
