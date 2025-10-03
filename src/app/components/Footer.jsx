import React from "react";

const Footer = () => {
    return (
        <div>
            <section className="lg:px-33 px-5 py-10 mt-30 border-t border-gray-800 backdrop-blur-3xl">
                <div className="flex lg:flex-row flex-col justify-between gap-15 lg:gap-3">
                    <div>
                        <h1 className="text-3xl font-bold">Logo</h1>
                        <p className="text-gray-400 w-[70%]">Read. Write. Learn. Enjoy</p>
                        <div className="flex items-center gap-3 mt-5">
                            <a href="" className="px-3 py-2 bg-[#000] text-white rounded-lg">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="" className="px-3 py-2 bg-[#000] text-white rounded-lg">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="" className="px-3 py-2 bg-[#000] text-white rounded-lg">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-1xl font-bold text-gray-100 capitalize mb-2">Company</h4>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                About Us
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Our Team
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Careers
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Press &amp; Media
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Privacy Policy
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Terms of Service
                            </a>{" "}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-1xl font-bold text-gray-100 capitalize mb-2">Solutions</h4>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Custom Web Development
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                E-commerce Solutions
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Enterprise Software
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Branding &amp; Identity
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Social Media Marketing
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                AI &amp; Automation
                            </a>{" "}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-1xl font-bold text-gray-100 capitalize mb-2">Resources</h4>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Blog &amp; Insights
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Customer Success Stories
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Help Center
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                E-books &amp; Guides
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Developer API
                            </a>{" "}
                        </p>
                        <p>
                            {" "}
                            <a href="#" className="text-gray-400 text-sm">
                                Partner Program
                            </a>{" "}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Footer;
