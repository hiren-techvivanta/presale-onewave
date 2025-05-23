import React, { useState } from "react";
import Topnav from "../../components/Topnav";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className="dashboard-container">
        {/* <Topnav /> */}
        <div className="row">
          <div className="col-12">
            <h1 className="text-center pt-5 mt-5">Wave Terms of Use</h1>
          </div>
          <div className="col-12">
            <div className="container pt-5">
              <div className="row">
                <div className="col-12 col-md-10 mx-auto">
                  <div className="card shadow border-0">
                    <div className="card-body">
                    <div className="text-end"><button className="btn btn-secondary" onClick={() => navigate(-1 || "/")}><i className="fa-solid fa-arrow-left pe-2"></i> Go Back</button></div>
                      <h5 className="text-info fw-bold">1. Acceptance of Terms</h5>
                      <p className="text-secondary">
                        Welcome to Wave! These Terms of Use ("Terms") govern
                        your access to and use of the Wave website, platform,
                        and services ("Services"). By accessing or using the
                        Services, you agree to be bound by these Terms and our
                        Privacy Policy. If you do not agree to these Terms,
                        please do not use the Services.
                      </p>

                      <h5 className="text-info fw-bold">2. Description of Services</h5>
                      <p>
                        Wave offers a comprehensive suite of services aimed at
                        empowering users to capitalize on the latest trends and
                        opportunities in the digital economy. Our platform
                        utilizes advanced AI-driven technology to provide users
                        with cutting-edge solutions for investment, gaming,
                        metaverse integration, NFT trading, and educational
                        technology. Here's an overview of our services:
                      </p>

                      <h5 className="text-info fw-normal">Arbitrage Trading Platform:</h5>
                      <p>
                        Wave's core offering is an AI-driven arbitrage trading
                        platform that allows users to invest in various assets,
                        including cryptocurrencies, commodities, and more. Our
                        platform employs sophisticated algorithms to identify
                        profitable opportunities and execute trades across
                        multiple exchanges, maximizing returns for users.
                      </p>

                      <h5 className="text-info fw-normal">Gaming Integration:</h5>
                      <p>
                        Wave Token (BWT) can be seamlessly integrated into
                        gaming platforms and ecosystems, serving as an in-game
                        currency or enabling in-game purchases. This integration
                        opens up new possibilities for gamers to monetize their
                        gaming experience and participate in virtual economies.
                      </p>

                      <h5 className="text-info fw-normal">Metaverse Integration:</h5>
                      <p>
                        We enable the integration of Wave Token into virtual
                        worlds and metaverse platforms, allowing users to buy
                        virtual assets, pay for virtual services, and
                        participate in virtual economies. This integration
                        facilitates seamless transactions and enhances the
                        immersive experience of virtual environments.
                      </p>

                      <h5 className="text-info fw-normal">NFT Marketplace:</h5>
                      <p>
                        Wave Token serves as a secure and efficient medium of
                        exchange on NFT marketplaces, enabling users to buy,
                        sell, and trade non-fungible tokens (NFTs). Our platform
                        provides a user-friendly interface and robust security
                        measures to facilitate smooth transactions and protect
                        users' digital assets.
                      </p>

                      <h5 className="text-info fw-normal">NFT Marketplace:</h5>
                      <p>
                        Wave Token can be utilized within educational technology
                        platforms for purchasing courses and accessing
                        educational content related to Web3, blockchain, and
                        other emerging technologies. This integration promotes
                        digital literacy and empowers users to stay ahead in the
                        rapidly evolving digital landscape.:
                      </p>
                      <p>
                        Wave AI invests on behalf of users using various tools
                        such as Sniping, Copy Trading, Sell Stop Loss, etc.
                        These advanced techniques are designed to maximize
                        returns in a short time efficiently, allowing users to
                        benefit from our expertise and experience in the
                        financial markets.
                      </p>
                      <p>
                        With Wave, users can unlock the full potential of the
                        digital economy and navigate the complexities of the
                        financial markets with confidence and ease. Join us
                        today and embark on a journey towards financial growth
                        and prosperity!
                      </p>

                      <h5 className="text-info fw-normal">Investment Tools and Techniques</h5>
                      <p>
                        Wave AI employs a variety of tools and techniques to
                        maximize returns and minimize risks for investors. Some
                        of these include:
                      </p>

                      <p>
                        <span className="fw-bold text-info">1 Sniping:</span>Our AI system
                        is capable of executing trades with split-second
                        precision, allowing us to capitalize on market movements
                        before they are reflected in asset prices.
                      </p>
                      <p>
                        <span className="fw-bold text-info">2 Copy Trading:</span> Users
                        have the option to leverage our Copy Trading feature,
                        which allows them to replicate the investment strategies
                        of successful traders or our AI algorithms, enhancing
                        their chances of success.
                      </p>

                      <p>
                        <span className="fw-bold text-info">3 Sell Stop Loss:</span> To protect investors from
                        significant losses, our platform incorporates Sell Stop
                        Loss mechanisms that automatically trigger the sale of
                        assets if prices fall below predefined thresholds,
                        mitigating downside risk.
                      </p>
                      <p>
                        <span className="fw-bold text-info">4 Portfolio Optimization:</span> Wave AI
                        continuously analyzes market conditions and adjusts
                        investment portfolios to optimize returns while
                        maintaining a balanced risk profile, ensuring that
                        users' investments are always positioned for success.
                      </p>

                      <h5 className="text-info fw-normal">Efficient Returns in a Short Timeframe</h5>
                      <p>
                        By leveraging these advanced tools and techniques, Wave
                        AI aims to deliver efficient returns for investors
                        within a short timeframe. Whether users are looking to
                        capitalize on short-term market trends or build
                        long-term wealth, our platform provides the tools and
                        expertise needed to achieve their financial goals with
                        confidence.
                      </p>

                      <h5 className="text-info fw-bold">3. User Accounts</h5>
                      <p>
                        At Wave, we prioritize user security and privacy. To
                        access certain features of our Services, such as trading
                        and portfolio management tools, users may be required to
                        create a user account. This account serves as a gateway
                        to our platform, enabling users to leverage our advanced
                        AI-driven investment tools and strategies.
                      </p>
                      <h5 className="text-info fw-normal">Account Creation</h5>
                      <p>
                        Creating a user account is a straightforward process
                        that requires users to provide basic information, such
                        as their name, email address, and a secure password.
                        Once registered, users gain access to a suite of
                        powerful investment tools and features designed to
                        enhance their investment experience.
                      </p>

                      <h5 className="text-info fw-normal">Confidentiality and Security</h5>
                      <p>
                        As a user, you are responsible for maintaining the
                        confidentiality of your account credentials, including
                        your password and any other login information. You agree
                        not to share your account credentials with anyone else
                        and to take reasonable precautions to prevent
                        unauthorized access to your account.
                      </p>

                      <h5 className="text-info fw-normal">Unauthorized Use</h5>
                      <p>
                        In the event of any unauthorized use of your account or
                        any suspicious activity, you agree to notify us
                        immediately. Prompt reporting of unauthorized access
                        enables us to take swift action to secure your account
                        and investigate any potential security breaches.
                      </p>

                      <h5 className="text-info fw-normal">Protecting Your Assets</h5>
                      <p>
                        IWe understand the importance of protecting your assets
                        and personal information. Our platform incorporates
                        robust security measures, including encryption protocols
                        and multi-factor authentication, to safeguard your
                        account and ensure the integrity of your investments.
                      </p>

                      <h5 className="text-info fw-normal">User Accountability</h5>
                      <p>
                        By creating a user account, you acknowledge and agree to
                        abide by our Terms of Use and Privacy Policy. You are
                        solely responsible for all activities that occur under
                        your account, including any transactions or investment
                        decisions made using our platform.
                      </p>

                      <h5 className="text-info fw-bold">4. User Conduct</h5>
                      <p>
                        At Wave, we prioritize integrity, transparency, and
                        adherence to legal and ethical standards. As a user of
                        our Services, you agree to conduct yourself in a manner
                        that complies with applicable laws and regulations and
                        aligns with the principles outlined in these Terms of
                        Use. Additionally, it's imperative to recognize and
                        acknowledge the inherent risks associated with
                        investing, as no guarantees of returns can be provided.
                      </p>

                      <h5 className="text-info fw-normal">Compliance with Laws and Regulations</h5>
                      <p>
                        Users are expected to use our Services in compliance
                        with all relevant laws, regulations, and industry
                        standards. This includes but is not limited to laws
                        related to financial transactions, securities
                        regulations, and data protection laws. By using our
                        platform, you agree to refrain from engaging in any
                        activities that may violate these laws or regulations.
                      </p>

                      <h5 className="text-info fw-normal">Prohibited Activities</h5>
                      <p>In using the Services, you agree not to:</p>
                      <ul>
                        <li>
                          <span className="fw-bold text-info">Unlawful Use:</span> Utilize the Services for
                          any unlawful or unauthorized purposes, including but
                          not limited to engaging in fraudulent activities or
                          money laundering.
                        </li>
                        <li>
                          <span className="fw-bold text-info">Disruption:</span> Interfere with or disrupt the
                          integrity or performance of the Services, including
                          but not limited to hacking, phishing, or denial of
                          service attacks.
                        </li>
                        <li>
                          <span className="fw-bold text-info">Unauthorized Access:</span> Attempt to gain
                          unauthorized access to the Services or any related
                          systems or networks, including exploiting security
                          vulnerabilities or bypassing access controls.
                        </li>
                        <li>
                          <span className="fw-bold text-info">Malicious Code: </span> Transmit any viruses,
                          worms, or other harmful code through the Services that
                          may compromise the security or functionality of the
                          platform or harm other users.
                        </li>
                        <li>
                          <span className="fw-bold text-info">Conduct Limitation:</span> Engage in any conduct
                          that restricts or inhibits any other user from using
                          or enjoying the Services, including harassment,
                          spamming, or other forms of abusive behavior.
                        </li>
                      </ul>
                      <h5 className="text-info fw-bold">5. Intellectual Property</h5>
                      <p>
                        At Wave, we take intellectual property rights seriously
                        and are committed to protecting our proprietary content
                        and materials. It is important for users to understand
                        their rights and responsibilities regarding the use of
                        our intellectual property.
                      </p>

                      <h5 className="text-info fw-normal">Ownership of Content</h5>
                      <p>
                        All content and materials available on the Wave
                        platform, including but not limited to text, graphics,
                        logos, images, and software, are the exclusive property
                        of Wave or its licensors. These materials are protected
                        by intellectual property laws, including copyright,
                        trademark, and trade secret laws.
                      </p>

                      <h5 className="text-info fw-normal">Restrictions on Use</h5>
                      <p>
                        Users are prohibited from using, reproducing,
                        distributing, or creating derivative works based on any
                        content or materials available on the Wave platform
                        without our prior written consent. This includes but is
                        not limited to:
                      </p>

                      <ul>
                        <li>
                          <span>Copying:</span> Reproducing any content or
                          materials from the platform, whether in whole or in
                          part, without authorization.
                        </li>
                        <li>
                          <span>Distribution:</span> Sharing or disseminating
                          content or materials from the platform to third
                          parties without permission.
                        </li>
                        <li>
                          <span>Modification:</span> Making any modifications or
                          alterations to the content or materials on the
                          platform without our consent.
                        </li>
                        <li>
                          <span>Derivative Works:</span> Creating new works
                          based on or derived from the content or materials on
                          the platform without authorization.
                        </li>
                      </ul>

                      <h5 className="text-info fw-normal">Prior Written Consent</h5>
                      <p>
                        Any use of Wave's intellectual property must be
                        authorized in advance and in writing by Wave or its
                        licensors. Users seeking permission to use our
                        intellectual property should contact us directly to
                        obtain the necessary permissions.
                      </p>

                      <h5 className="text-info fw-normal">Enforcement of Rights</h5>
                      <p>
                        Wave reserves the right to take appropriate legal action
                        against any unauthorized use or infringement of its
                        intellectual property rights. This may include seeking
                        injunctive relief, damages, or other remedies available
                        under applicable law.
                      </p>
                      <p>
                        By using the Wave platform, users agree to respect and
                        abide by our intellectual property rights. We appreciate
                        your cooperation in protecting our proprietary content
                        and materials and ensuring that our platform remains a
                        safe and secure environment for all users. If you have
                        any questions or concerns about the use of our
                        intellectual property, please contact us for further
                        assistance.
                      </p>

                      <h5 className="text-info fw-bold">6. Disclaimer of Warranties</h5>
                      <p>
                        The Services are provided on an "as is" and "as
                        available" basis, without any warranties of any kind,
                        express or implied. We do not warrant that the Services
                        will be uninterrupted or error-free, or that any defects
                        will be corrected. Your use of the Services is at your
                        own risk.
                      </p>

                      <h5 className="text-info fw-bold">7. Limitation of Liability</h5>
                      <p>
                        In no event shall Wave or its affiliates be liable for
                        any indirect, incidental, special, or consequential
                        damages arising out of or in connection with your use of
                        the Services. Our total liability to you for any claim
                        arising out of or in connection with these Terms or the
                        Services shall not exceed the amount paid by you, if
                        any, for the use of the Services.
                      </p>

                      <h5 className="text-info fw-normal">Acknowledgment of Risk</h5>
                      <p>
                        While Wave strives to provide sustainable returns for
                        its users through innovative investment strategies and
                        advanced AI technology, it's important to recognize that
                        investing inherently involves risk. We do not make any
                        guarantees or promises of returns, and users should be
                        aware that there is always a possibility of loss.
                        Therefore, it is essential for users to carefully
                        consider their investment decisions and be prepared for
                        the potential risks involved.
                      </p>

                      <h5 className="text-info fw-bold">8. Indemnification</h5>
                      <p>
                        You agree to indemnify, defend, and hold harmless Wave
                        and its affiliates from and against any and all claims,
                        liabilities, damages, losses, costs, or expenses arising
                        out of or in connection with your use of the Services or
                        any breach of these Terms by you.
                      </p>
                      <h5 className="text-info fw-bold">9. Modifications to Terms</h5>
                      <p>
                        We reserve the right to modify or update these Terms at
                        any time without prior notice. Your continued use of the
                        Services after any such modifications or updates
                        constitutes your acceptance of the revised Terms.
                      </p>
                      <h5 className="text-info fw-bold">10. Governing Law</h5>
                      <p>
                        These Terms shall be governed by and construed in
                        accordance with the laws of [Jurisdiction]. Any dispute
                        arising out of or in connection with these Terms shall
                        be subject to the exclusive jurisdiction of the courts
                        of [Jurisdiction].
                      </p>

                      <h5 className="text-info fw-bold">11. Contact Us</h5>
                      <p>If you have any questions or concerns about these Terms or the Services, please contact us at support@onewave.app.</p>
                      <p>By using the Wave platform, you agree to abide by these Terms of Use. Thank you for choosing Wave for your investment needs!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
