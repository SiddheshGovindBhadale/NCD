import React from 'react'
import './style.css'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <header>
                <div className="container">
                    <div className="h_leftside">
                        <h3>MakeSure</h3>
                        <ul>
                            <li><a href="/#">Home</a></li>
                            <li><a href="/#">Insurance</a></li>
                            <li><a href="/#">About us</a></li>
                            <li><a href="/#">Get Helps</a></li>
                        </ul>
                    </div>
                    <i className="fa-solid fa-bars"></i>
                    <div className="h_rightside">
                        <button>Register</button>
                        <button className="active">Sign in</button>
                    </div>
                </div>
            </header>

            <section className="first_section">
                <div className="container">
                    <div className="s_leftside">
                        <h1>Insurance make your life Better.</h1>
                        <p>Having life insurance is a smart choice for us.Where you can get many benefits from a life insurance.</p>
                        <button className="active">Let's Talk</button>
                        <button>Learn More</button>
                    </div>
                    <div className="s_rightside">
                        <img src={require("./img/first image.jpg")} alt="" />
                    </div>
                </div>
            </section>

            <section className="company">
                <div className="container">
                    <p>We work with the best companies in the world.</p>
                    <div className="row">
                        <img src={require("./img/home.jpg")} alt="" />
                        <img src={require("./img/company2.jpg")} alt="" />
                        <img src={require("./img/company3.jpg")} alt="" />
                        <img src={require("./img/company4.jpg")} alt="" />
                        <img src={require("./img/company5.jpg")} alt="" />
                    </div>
                </div>
            </section>

            <section className="register">
                <div className="container">
                    <h2>Apply for claim Insurance.</h2>
                    <p>Claim for insurance now and gets many benefits from us.</p>
                    <div>
                        <Link to="/claimform">
                            <button className="active">Claim</button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="benefits">
                <div className="container">
                    <h2>Benefits if you have Insurance.</h2>
                    <div className="row">
                        <div className="box">
                            <i className="fa-solid fa-id-card"></i>
                            <h5>Make life More Better</h5>
                            <p>Make your life better because your life is very valuable so gurantee your life by using our insurance.</p>
                            <button className="active">Learn More</button>
                        </div>

                        <div className="box">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                            <h5>Insurance is an Investment</h5>
                            <p>Insurance is not only insurance but also part of an investment for you in the future so that your life can be guranteed and also better.</p>
                            <button className="active">Learn More</button>
                        </div>

                        <div className="box">
                            <i className="fa-solid fa-shield-halved"></i>
                            <h5>Life Gurantee</h5>
                            <p>Life insurance in old age, if you experience something you don't have to worry because it's already covered by Insurance.</p>
                            <button className="active">Learn More</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="better">
                <div className="container">
                    <div className="s_leftside">
                        <img src={require("./img/children.jpg")} alt="" />
                    </div>
                    <div className="s_rightside">
                        <h3>
                            Why are we Better than than others.
                        </h3>
                        <p>We have been in this insurance bussiness for more than 20 years, that's why we can be trusted by clients.</p>

                        <i className="fa-solid fa-circle-check"></i>
                        <h4>Certified Insurance</h4>
                        <p>Don't worry we gone through the certification process so our insurance is very safe for you. Be a part of us</p>

                        <i className="fa-solid fa-circle-check"></i>
                        <h4> 20+ years of Experience.</h4>
                        <p>For more than 20 years we have severed people using insurance that's why we want to continue to dedicate to you.</p>

                        <i className="fa-solid fa-circle-check"></i>
                        <h4>24/7 Support</h4>
                        <p>We are always there for 24/7 because your satisfaction is success for you to continue to improve quality.</p>
                    </div>
                </div>
            </section>

            <section className="choice">
                <div className="container">
                    <h2>Make your choice of insurance Now.</h2>
                    <div className="row">

                        <div className="box">
                            <i className="fa-solid fa-hospital-user"></i>
                            <h5>Old age Gurantee Insurance</h5>
                            <ol>
                                <li>Protected if you fall sick</li>
                                <li>Life fells safer</li>
                                <li>Health plan updates</li>
                            </ol>
                            <button className="active">Choose Plan</button>
                        </div>


                        <div className="box">
                            <i className="fa-solid fa-hospital"></i>
                            <h5>Health Insurance</h5>
                            <ol>
                                <li>Get Health benefits</li>
                                <li>Life fell safer</li>
                                <li>Invest Health Insurance</li>
                            </ol>
                            <button className="active">Choose Plan</button>
                        </div>


                        <div className="box">
                            <i className="fa-solid fa-graduation-cap"></i>
                            <h5>Education Insurance</h5>
                            <ol>
                                <li>Gurantee education up to collage</li>
                                <li>Safer Education costs.</li>
                                <li>Success with Insurance.</li>
                            </ol>
                            <button className="active">Choose Plan</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="latestnews">
                <div className="container">
                    <div className="first">
                        <h1>Our Latest News and Articles</h1>
                        <p>The Latest articles and news that you can read to insurance your knoweldge about insurance.</p>
                        <button className="active">Choose Plan</button>
                    </div>
                    <div className="second">
                        <img src={require("./img/family.jpg")} alt="" />
                        <h4>Insurance really helps your life and your family.</h4>
                        <p>Insurance reallyhelps your life to live better in the future... </p>
                        <span>By Emilia Johnson</span>
                        <em>10 Mrach</em>
                    </div>
                    <div className="third">
                        <img src={require("./img/friend.jpg")} alt="" />
                        <h4>This life Gurantee will be very Useful with insurance.</h4>
                        <p>Insurance reallyhelps your life to live better in the future... </p>
                        <span>By Emilia Johnson</span>
                        <em>10 Mrach</em>
                    </div>
                </div>
            </section>

            <section className="clients">
                <h3>Our Satisfied clients</h3>
                <p>we always pritize clients satisfaction to provide the best service.</p>
                <div className="row">

                    <div className="box">
                        <img src={require("./img/profilepict (1).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                    <div className="box">
                        <img src={require("./img/profilepict (2).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                    <div className="box">
                        <img src={require("./img/profilepict (3).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                    <div className="box">
                        <img src={require("./img/profilepict (4).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                    <div className="box">
                        <img src={require("./img/profilepict (4).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                    <div className="box">
                        <img src={require("./img/profilepict (4).jpg")} alt="" />
                        <p>"I am very to be joining to be make sure because they are fast in responding to my message and their insurance services make our lives easy..."</p>
                        <h4>Adip Faturranchaman</h4>
                        <div className="star_rting">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>Employees</span>
                        <em>4.8 rating</em>
                    </div>

                </div>
            </section>

            <section className="register">
                <div className="container">
                    <h2>Register for Insurance Now.</h2>
                    <p>Register for insurance now and gets many benefits from us.</p>
                    <div>
                        <button className="active">Register</button>
                        <button>Sign in </button>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="column first">
                        <h5>Make Sure</h5>
                        <p>Having life Insurance is a smart choice for us.
                            where you can get many benefits from a life insurance.
                        </p>
                    </div>

                    <div className="column second">
                        <h5>Company</h5>
                        <a href="/#">About Us</a>
                        <a href="/#">Product</a>
                        <a href="/#">Testimonial</a>
                    </div>

                    <div className="column second">
                        <h5>Support</h5>
                        <a href="/#">FAQ</a>
                        <a href="/#">Privacy Policy</a>
                        <a href="/#">Terms of Service</a>
                    </div>

                    <div className="column second">
                        <h5>Our Works</h5>
                        <a href="/#">Pricing</a>
                        <a href="/#">Clients</a>
                        <a href="/#">Products</a>
                    </div>

                    <div className="column social">
                        <h5>Facebook</h5>
                        <h5>Instgram</h5>
                    </div>
                </div>
                <p>2022 Make Sure .All right Reserved.</p>
            </footer>
        </>
    )
}

export default Home