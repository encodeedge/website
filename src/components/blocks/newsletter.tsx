import { useEffect } from "react";
import { Mail } from "lucide-react";

export const Newsletter = () => {
  useEffect(() => {
    // Set global variables required by Brevo
    (window as any).REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
    (window as any).LOCALE = 'en';
    (window as any).EMAIL_INVALID_MESSAGE = (window as any).SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    (window as any).REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
    (window as any).GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    (window as any).translation = {
      common: {
        selectedList: '{quantity} list selected',
        selectedLists: '{quantity} lists selected',
        selectedOption: '{quantity} selected',
        selectedOptions: '{quantity} selected',
      }
    };
    (window as any).AUTOHIDE = Boolean(0);

    // Load Brevo main script
    const scriptMain = document.createElement('script');
    scriptMain.src = 'https://sibforms.com/forms/end-form/build/main.js';
    scriptMain.defer = true;
    document.body.appendChild(scriptMain);

    // Load ReCaptcha script
    const scriptRecaptcha = document.createElement('script');
    scriptRecaptcha.src = 'https://www.google.com/recaptcha/api.js?render=6LezCFYsAAAAAGcQiaxNXL3y1SkK-GyVqbYeuzr1&hl=en';
    scriptRecaptcha.async = true;
    scriptRecaptcha.defer = true;
    document.body.appendChild(scriptRecaptcha);

    return () => {
      document.body.removeChild(scriptMain);
      document.body.removeChild(scriptRecaptcha);
    };
  }, []);

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Subscribe to our newsletter
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Join 10,000+ engineers and researchers. Get the latest AI trends, tutorials, and insights delivered straight to your inbox.
          </p>
          
          {/* Brevo Form Integration */}
          <div className="w-full flex justify-center mt-6">
            <link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css" />
            <style>{`
              @font-face {
                font-display: block;
                font-family: Roboto;
                src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
              }
              @font-face {
                font-display: fallback;
                font-family: Roboto;
                font-weight: 600;
                src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
              }
              @font-face {
                font-display: fallback;
                font-family: Roboto;
                font-weight: 700;
                src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
              }
              #sib-container input:-ms-input-placeholder {
                text-align: left;
                font-family: Helvetica, sans-serif;
                color: #c0ccda;
              }
              #sib-container input::placeholder {
                text-align: left;
                font-family: Helvetica, sans-serif;
                color: #c0ccda;
              }
              #sib-container textarea::placeholder {
                text-align: left;
                font-family: Helvetica, sans-serif;
                color: #c0ccda;
              }
              #sib-container a {
                text-decoration: underline;
                color: #2BB2FC;
              }
              /* Custom overrides to blend with the site */
              #sib-container {
                background-color: transparent !important;
                border: none !important;
              }
              /* Hide Brevo's internal title/description to avoid duplication */
              #sib-form > div:nth-child(1),
              #sib-form > div:nth-child(2) {
                display: none;
              }
            `}</style>
            
            <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <div id="sib-form-container" className="sib-form-container">
                <div id="error-message" className="sib-form-message-panel" style={{ fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#661d1d', backgroundColor: '#ffeded', borderRadius: '3px', borderColor: '#ff4949', maxWidth: '540px' }}>
                  <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                    <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                      <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
                    </svg>
                    <span className="sib-form-message-panel__inner-text">
                      Your subscription could not be saved. Please try again.
                    </span>
                  </div>
                </div>
                <div></div>
                <div id="success-message" className="sib-form-message-panel" style={{ fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#085229', backgroundColor: '#e7faf0', borderRadius: '3px', borderColor: '#13ce66', maxWidth: '540px' }}>
                  <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                    <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
                    </svg>
                    <span className="sib-form-message-panel__inner-text">
                      Your subscription has been successful.
                    </span>
                  </div>
                </div>
                <div></div>
                <div id="sib-container" className="sib-container--large sib-container--vertical" style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,1)', maxWidth: '540px', borderRadius: '3px', borderWidth: '1px', borderColor: '#C0CCD9', borderStyle: 'solid', direction: 'ltr' }}>
                  <form id="sib-form" method="POST" action="https://abda04e7.sibforms.com/serve/MUIFAFqYiF-Io1nHHwCulCQZZdSYvtMTBQxPE12NxLiTmxhpjpkjD5_FV_Nrm6CwY-t-QmzFw7fHsyKpCQINhIkCRriCmMyjzJAS58nJ4X9ztB8taZsvXhXzZ8udhKV_6LKu2zx9KoE3XlQjUOQgaLHdIJ567z8oh_nPxviJyF2GeXajyM-M2mhWnLkoXBo0JDIBYYb6Vks0VVpi" data-type="subscription">
                    <div style={{ padding: '8px 0' }}>
                      <div className="sib-form-block" style={{ fontSize: '32px', textAlign: 'left', fontWeight: 700, fontFamily: 'Helvetica, sans-serif', color: '#3C4858', backgroundColor: 'transparent' }}>
                        <p>Newsletter</p>
                      </div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <div className="sib-form-block" style={{ fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#3C4858', backgroundColor: 'transparent' }}>
                        <div className="sib-text-form-block">
                          <p>Subscribe to our newsletter and stay updated.</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <label className="entry__label" style={{ fontWeight: 700, textAlign: 'left', fontSize: '16px', fontFamily: 'Helvetica, sans-serif', color: '#3c4858' }} htmlFor="EMAIL" data-required="*">Enter your email address to subscribe</label>
                            <div className="entry__field">
                              <input className="input " type="text" id="EMAIL" name="EMAIL" autoComplete="off" placeholder="EMAIL" data-required="true" required />
                            </div>
                          </div>
                          <label className="entry__error entry__error--primary" style={{ fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#661d1d', backgroundColor: '#ffeded', borderRadius: '3px', borderColor: '#ff4949' }}>
                          </label>
                          <label className="entry__specification" style={{ fontSize: '12px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#8390A4' }}>
                            Provide your email address to subscribe. For e.g abc@xyz.com
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <div className="g-recaptcha-v3" data-sitekey="6LezCFYsAAAAAGcQiaxNXL3y1SkK-GyVqbYeuzr1" style={{ display: 'none' }}></div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <div className="sib-form-block" style={{ textAlign: 'left' }}>
                        <button className="sib-form-block__button sib-form-block__button-with-loader" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 700, fontFamily: 'Helvetica, sans-serif', color: '#FFFFFF', backgroundColor: '#3533CD', borderRadius: '3px', borderWidth: '0px' }} form="sib-form" type="submit">
                          <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                            <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                          </svg>
                          SUBSCRIBE
                        </button>
                      </div>
                    </div>
                    <input type="text" name="email_address_check" value="" className="input--hidden" readOnly />
                    <input type="hidden" name="locale" value="en" />
                  </form>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};