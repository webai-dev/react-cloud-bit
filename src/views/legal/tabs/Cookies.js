import React from 'react';

const Cookies = () => (
  <div>
    <h3 className="mt-2">Cookies</h3>
    <p>
      Cookies are small data files sent to your browser when you visit a site. We use both our own
      cookies, as well as third-party cookies, to do a few different things:
    </p>
    <ul>
      <li>Log you in to our services</li>
      <li>Remember preferences and settings</li>
      <li>Keep your account secure</li>
      <li>
        Better understand how people are using our services, and improve and promote those services
        based on that information
      </li>
    </ul>
    <p>
      To promote our services, we use third-party service providers that may set cookies on your
      device. This helps third-party service providers understand your advertising preferences, so
      they can show you ads that are more relevant to your interests.
    </p>
    <h3 className="mt-10">Pixels</h3>
    <p>
      A pixel tag ("pixel") is a small piece of code that can be embedded on websites and emails. We
      use pixels and cookies to learn how you interact with our webpages and emails. This
      information helps us, and the advertising services providers we use, better promote our
      services. For example, if you visit one of our Ybit pages, you may later see an ad for Ybit
      when you visit a wellness news site.
    </p>
    <h3 className="mt-10">OPT-OUT and DNT</h3>
    <p>
      You can set your browser to not accept cookies, but this may limit your ability to use the
      Services. Our systems currently don’t respond to DNT:1 signals from browsers visiting our
      websites, but Ybit adheres to the Digital Advertising Alliance’s Self-Regulatory Principles
      for Online Behavioral Advertising ("Principles").
    </p>
    <p>
      You can opt-out of collection of information by third-parties that adhere to the Principles
      and that we use to help us promote our services by visiting <a
        href="www.aboutads.info/choices"
        target="_blank"
      >
        www.aboutads.info/choices
      </a>.
    </p>
  </div>
);

export default Cookies;
