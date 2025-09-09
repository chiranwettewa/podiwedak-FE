import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        tasks: 'Browse Tasks',
        post: 'Post Task',
        dashboard: 'Dashboard',
        profile: 'Profile',
        wallet: 'Wallet',
        help: 'Help'
      },
      auth: {
        login: 'Login',
        signup: 'Sign Up',
        loginWithGoogle: 'Login with Google',
        loginWithFacebook: 'Login with Facebook',
        phoneNumber: 'Phone Number',
        otp: 'Enter OTP',
        sendOTP: 'Send OTP'
      },
      tasks: {
        searchPlaceholder: 'Search tasks...',
        categories: 'Categories',
        location: 'Location',
        budget: 'Budget',
        postTask: 'Post a Task',
        makeOffer: 'Make Offer',
        viewDetails: 'View Details'
      },
      common: {
        search: 'Search',
        filter: 'Filter',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        loading: 'Loading...',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode'
      }
    }
  },
  si: {
    translation: {
      nav: {
        home: 'මුල් පිටුව',
        tasks: 'කාර්ය බලන්න',
        post: 'කාර්යය පළ කරන්න',
        dashboard: 'උපකරණ පුවරුව',
        profile: 'පැතිකඩ',
        wallet: 'පසුම්බිය',
        help: 'උදව්'
      },
      auth: {
        login: 'ප්‍රවේශ වන්න',
        signup: 'ලියාපදිංචි වන්න',
        loginWithGoogle: 'Google සමඟ ප්‍රවේශ වන්න',
        loginWithFacebook: 'Facebook සමඟ ප්‍රවේශ වන්න',
        phoneNumber: 'දුරකථන අංකය',
        otp: 'OTP ඇතුළත් කරන්න',
        sendOTP: 'OTP යවන්න'
      },
      tasks: {
        searchPlaceholder: 'කාර්ය සොයන්න...',
        categories: 'කාණ්ඩ',
        location: 'ස්ථානය',
        budget: 'අයවැය',
        postTask: 'කාර්යය පළ කරන්න',
        makeOffer: 'යෝජනාව කරන්න',
        viewDetails: 'විස්තර බලන්න'
      },
      common: {
        search: 'සොයන්න',
        filter: 'පෙරහන',
        save: 'සුරකින්න',
        cancel: 'අවලංගු කරන්න',
        submit: 'ඉදිරිපත් කරන්න',
        loading: 'පූරණය වෙමින්...',
        darkMode: 'අඳුරු මාදිලිය',
        lightMode: 'ආලෝක මාදිලිය'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
