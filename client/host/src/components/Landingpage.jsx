import React,{useState, useRef} from "react";
import Homepage from "./Homepage";
import "./Landingpage.css";

const Landingpage = () => {
    const [showHomepage, setShowHomepage] = useState(false);
    const inputRef = useRef(null);
    const handleVerification = () => {
        const email = inputRef.current.value;
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        if (email && isValidEmail) {
            setShowHomepage(true);
        }else{
            alert("Please enter a valid email address.");
        }
    };

    return (
        <>
        {!showHomepage && <main className="landing-page-container">
            <section className="landing-page-left page-section">
                <div className="left-content section-content">
                <h2>GearUp <span className="fashion-text">fashion</span><span className="lifestyle-text">Lifestyle</span><br></br> with GenZTrends</h2>
                <p>Discover the latest fashion trends curated for Gen Z. Stay ahead with styles that speak your vibe.Your style, your rules. GenZTrends helps you discover looks that feel fresh, fearless, and totally you. No overthinking—just drip that speaks.</p>
                <p>We are almost here to explore the world of fashion</p>
                {/* <label htmlFor="email" className="email-label">Enter your email..</label>
                <input ref={inputRef} type="email" placeholder="Enter your email" className="email-input" />
                <button onClick={handleVerification} className="get-started-button">Let's Go</button> */}
                </div>
            </section>
            {/* <hr></hr> */}
            <section className="landing-page-right page-section">
                <div className="right-content section-content">
                    <input ref={inputRef} type="email" placeholder="Enter your email" className="email-input" />
                    <button onClick={handleVerification} className="get-started-button">Let's Go</button>
                </div>
            </section>

        </main>}
        {showHomepage && <Homepage />}
        </>
    );
}
   
export default Landingpage;