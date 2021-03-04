import React from 'react';
import './css/LandingHeadPage.css';
import build from './img/feature-tile__build.png';
import platform from './img/feature-tile__platform.png';
import projects from './img/feature-tile__projects.png';
import work from './img/feature-tile__work.png';

function LandingHeadPage() {
    return (
        <div className="LandingBody">
            <section className="section section--visual">
                <div className="inner">
                    <div className="summary">
                        <h2 className="summary__title">How people build&nbsp;software</h2>
                        <p className="summary__description">
                            Millions of developers use GitHub to build personal projects, support
                            their businesses, and&nbsp;work together on open source technologies.
                        </p>
                    </div>
                    <form id="sign-form" method="POST" action="#">
                        <ul>
                            <li>
                                <input
                                    type="text"
                                    className="input--text"
                                    placeholder="E-mail address"
                                />
                            </li>
                            <li>
                                <input
                                    type="password"
                                    className="input--text"
                                    placeholder="password"
                                />
                            </li>
                            <li>
                                <button type="submit" className="btn btn--primary">
                                    Sign Up for Seoul IT
                                </button>
                                <p className="caption">Click the button to register your account</p>
                            </li>
                        </ul>
                    </form>
                </div>
            </section>
            <section className="section section--feature">
                <div className="summary">
                    <h2 className="summary__title">Welcome to Seoul IT</h2>
                </div>
                <div className="video">
                    <div className="video-ratio">
                        <iframe
                            width="1274"
                            height="630"
                            src="https://www.youtube.com/embed/afvT1c1ii0c"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div className="tiles">
                    <div className="inner">
                        <ul className="clearfix">
                            <li>
                                <img alt="build" src={build} />
                                <h3>For everything you build</h3>
                                <p>
                                    Host and manage your code on GitHub. You can keep your work
                                    private or share it with the world.
                                </p>
                            </li>
                            <li>
                                <img src={work} alt="work" />
                                <h3>A better way to work</h3>
                                <p>
                                    From hobbyists to professionals, GitHub helps developers
                                    simplify the way they build software.
                                </p>
                            </li>
                            <li>
                                <img src={projects} alt="projects" />
                                <h3>Millions of projects</h3>
                                <p>
                                    GitHub is home to millions of open source projects. Try one out
                                    or get inspired to create your own.
                                </p>
                            </li>
                            <li>
                                <img src={platform} alt="platform" />
                                <h3>One platform, from start to finish</h3>
                                <p>
                                    With hundreds of integrations, GitHub is flexible enough to be
                                    at the center of your development process.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingHeadPage;
