import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Check if Tawk.to is already loaded to prevent duplicates
    if (window.Tawk_API && window.Tawk_API.showWidget) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68c7c85653558c1921183e23/1j566d6rh';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Insert the script
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector(`script[src="https://embed.tawk.to/68c7c85653558c1921183e23/1j566d6rh"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      
      // Also remove any Tawk.to iframe
      const tawkIframe = document.getElementById('tawkIframe');
      if (tawkIframe) {
        tawkIframe.remove();
      }
      
      // Reset Tawk_API
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TawkToChat;