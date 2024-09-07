

document.getElementById('prod').addEventListener('click', function() {
    document.getElementById('product-popup').style.display = 'flex';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('product-popup').style.display = 'none';
});

//new af

//end of new af

document.addEventListener("DOMContentLoaded", function() {


    // Event listener for the "Analyze the Product" button to show the pop-up
    document.getElementById('prod').addEventListener('click', function() {
        document.getElementById('product-popup').style.display = 'flex';
    });

    // Event listener for the close button to hide the pop-up
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('product-popup').style.display = 'none';
    });

    // Event listener for clicking outside the pop-up content to hide the pop-up
    document.getElementById('product-popup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    const productTypeDropdown = document.getElementById("product-type");
    const productNameInput = document.getElementById("product-name");

    // Initially disable the product name input field
    productNameInput.disabled = true;
    productNameInput.placeholder = "Select an option first";



    // Event listener for the dropdown selection
    productTypeDropdown.addEventListener("change", function() {
        if (productTypeDropdown.value) {
            // Enable the product name input field
            productNameInput.disabled = false;
            productNameInput.placeholder = "Enter product name";
        } else {
            // Keep the product name input field disabled
            productNameInput.disabled = true;
            productNameInput.placeholder = "Select an option first";
        }
    });
});


//Add event listener for the microphone icon
document.querySelector('.microphone-icon').addEventListener('click', function() {
    // Check if browser supports SpeechRecognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // Set the language as per your need
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Start voice recognition when the microphone is clicked
        recognition.start();

        recognition.onstart = function() {
            console.log("Voice recognition activated. Try speaking...");
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log("You said: " + transcript);
            
            // Set the recognized speech into the product name input field
            productNameInput.value = transcript;
        };

        recognition.onspeechend = function() {
            recognition.stop();
            console.log("Voice recognition ended.");
        };

        recognition.onerror = function(event) {
            console.log("Error occurred in recognition: " + event.error);
        };
    } else {
        alert("Sorry, your browser doesn't support speech recognition.");
    }
});





document.getElementById('product-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

let capturedImageData = null; // To store the captured image data

// Google Lens functionality to access the device's camera
document.querySelector('.google-lens-icon').addEventListener('click', function() {
    // Alert to indicate that Google Lens is activated
    alert('Google Lens activated for photo input!');

    // Check if the browser supports media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Ask for permission to access the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Create the video element and pop-up
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Create a pop-up to display the video feed
                const cameraPopup = document.createElement('div');
                cameraPopup.classList.add('camera-popup');
                document.body.appendChild(cameraPopup);

                const captureButton = document.createElement('button');
                captureButton.innerText = 'Capture';
                cameraPopup.appendChild(video);
                cameraPopup.appendChild(captureButton);

                captureButton.addEventListener('click', function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Stop the video stream after capturing the image
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());

                    // Store the image as a data URL (base64 format)
                    capturedImageData = canvas.toDataURL('image/png');

                    // Replace the video with the captured image
                    video.style.display = 'none';
                    const imgPreview = document.createElement('img');
                    imgPreview.src = capturedImageData;
                    imgPreview.style.width = '100%';
                    cameraPopup.appendChild(imgPreview);

                    // Create Submit and Retake buttons
                    const submitButton = document.createElement('button');
                    submitButton.innerText = 'Submit Image';
                    const retakeButton = document.createElement('button');
                    retakeButton.innerText = 'Retake Image';
                    
                    cameraPopup.appendChild(submitButton);
                    cameraPopup.appendChild(retakeButton);

                    // Submit Image
                    submitButton.addEventListener('click', function() {
                        // Remove the camera popup and show the product popup with the captured image
                        cameraPopup.remove();

                        // Show the captured image in the product input pop-up
                        const productPopup = document.getElementById('product-popup');
                        const existingImg = productPopup.querySelector('img');
                        if (existingImg) {
                            existingImg.remove();
                        }
                        const imgElement = document.createElement('img');
                        imgElement.src = capturedImageData;
                        imgElement.alt = "Captured Image";
                        imgElement.style.width = '100px'; // Adjust size as needed
                        productPopup.appendChild(imgElement);

                        // Display a confirmation message
                        alert('Picture captured and added to the product pop-up!');
                    });

                    // Retake Image
                    retakeButton.addEventListener('click', function() {
                        cameraPopup.remove(); // Remove the current popup
                        document.querySelector('.google-lens-icon').click(); // Reactivate the camera
                    });
                });
            })
            .catch(function(error) {
                console.error('Error accessing the camera: ', error);
                alert('Could not access the camera.');
            });
    } else {
        alert('Camera access is not supported in this browser.');
    }
});

// Event listener for form submission
document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    // Ensure the picture is captured before submitting
    if (!capturedImageData) {
        alert('Please capture an image before submitting.');
        return;
    }

    // Gather the form data
    const productType = document.getElementById('product-type').value;
    const productName = document.getElementById('product-name').value;
    const productWeight = document.getElementById('product-weight').value;

    // Create an object to simulate form submission
    const formData = {
        productType,
        productName,
        productWeight,
        capturedImage: capturedImageData, // Add the captured image data to the form
    };

    // Simulate form submission (for demo purposes, log the data)
    console.log('Form Submitted:', formData);

    alert('Form submitted successfully with the captured image!');
});


// Event listener for form submission
document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    // Ensure the picture is captured before submitting
    if (!capturedImageData) {
        alert('Please capture an image before submitting.');
        return;
    }

    // Gather the form data
    const productType = document.getElementById('product-type').value;
    const productName = document.getElementById('product-name').value;
    const productWeight = document.getElementById('product-weight').value;

    // Create an object to simulate form submission
    const formData = {
        productType,
        productName,
        productWeight,
        capturedImage: capturedImageData, // Add the captured image data to the form
    };

    // Simulate form submission (for demo purposes, log the data)
    console.log('Form Submitted:', formData);

    alert('Form submitted successfully with the captured image!');
});




// JavaScript to toggle the dropdown visibility
document.getElementById("nav-languages").addEventListener("click", function(event) {
    event.preventDefault();
    var dropdown = document.getElementById("language-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

document.getElementById("mobile-nav-languages").addEventListener("click", function(event) {
    event.preventDefault();
    var dropdown = document.getElementById("mobile-language-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Close the dropdown if the user clicks outside of it
window.addEventListener("click", function(event) {
    if (!event.target.matches('#nav-languages') && !event.target.matches('#mobile-nav-languages')) {
        document.getElementById("language-dropdown").style.display = "none";
        document.getElementById("mobile-language-dropdown").style.display = "none";
    }
});


//store transalations
const translations = {
    en: {
        home: "Home",
        features: "Features",
        contact: "Contact",
        about: "About",
        languages: "Languages",
        bannerHeading: "Welcome to NeerVana",
        bannerText: "Track and optimize your water usage effortlessly with our innovative app.",
        analyzeProduct: "ANALYZE THE PRODUCT",
        productInputHeading: "Product Input",
        selectProductType: "Select type of product",
        enterProductName: "Enter product name",
        enterWeight: "Enter weight in kgs",
        submit: "Submit",
        featuresHeading: "Features",
        smartRecommendations: "Smart Recommendations",
        realTimeData: "Real-Time Data",
        localizedInsights: "Localized Insights",
        weeklyUsage: "Weekly Usage",
        contactHeading: "Contact Us",
        nameLabel: "Name",
        emailLabel: "Email",
        messageLabel: "Message",
        sendMessage: "Send Message",
        aboutUsHeading: "About Us",
        aboutUsText: "HydroHackers is dedicated to improving water usage efficiency. Our app leverages advanced technologies to provide insights and recommendations to help you make sustainable choices.",
        footerText: "&copy; 2024 HydroHackers. All rights reserved."
    },
    hi: {
        home: "मुखपृष्ठ",
        features: "विशेषताएँ",
        contact: "संपर्क करें",
        about: "हमारे बारे में",
        languages: "भाषाएँ",
        bannerHeading: "नेरवाना में आपका स्वागत है",
        bannerText: "हमारे अभिनव ऐप के साथ अपने पानी के उपयोग को ट्रैक और अनुकूलित करें।",
        analyzeProduct: "उत्पाद का विश्लेषण करें",
        productInputHeading: "उत्पाद इनपुट",
        selectProductType: "उत्पाद प्रकार का चयन करें",
        enterProductName: "उत्पाद का नाम दर्ज करें",
        enterWeight: "किलोग्राम में वजन दर्ज करें",
        submit: "जमा करें",
        featuresHeading: "विशेषताएँ",
        smartRecommendations: "स्मार्ट सिफारिशें",
        realTimeData: "वास्तविक समय डेटा",
        localizedInsights: "स्थानीयकृत अंतर्दृष्टि",
        weeklyUsage: "साप्ताहिक उपयोग",
        contactHeading: "संपर्क करें",
        nameLabel: "नाम",
        emailLabel: "ईमेल",
        messageLabel: "संदेश",
        sendMessage: "संदेश भेजें",
        aboutUsHeading: "हमारे बारे में",
        aboutUsText: "हाइड्रोहैकर्स पानी के उपयोग की दक्षता में सुधार के लिए समर्पित है। हमारा ऐप उन्नत तकनीकों का लाभ उठाता है ताकि आपको स्थायी विकल्प बनाने में मदद मिल सके।",
        footerText: "&copy; 2024 हाइड्रोहैकर्स। सर्वाधिकार सुरक्षित।"
    },
    bn: {
        home: "হোম",
        features: "বৈশিষ্ট্য",
        contact: "যোগাযোগ করুন",
        about: "আমাদের সম্পর্কে",
        languages: "ভাষাসমূহ",
        bannerHeading: "নীরভানায় আপনাকে স্বাগতম",
        bannerText: "আমাদের উদ্ভাবনী অ্যাপ দিয়ে সহজেই আপনার পানির ব্যবহার ট্র্যাক এবং অপ্টিমাইজ করুন।",
        analyzeProduct: "পণ্য বিশ্লেষণ করুন",
        productInputHeading: "পণ্য ইনপুট",
        selectProductType: "পণ্যের প্রকার নির্বাচন করুন",
        enterProductName: "পণ্যের নাম লিখুন",
        enterWeight: "ওজন কেজিতে লিখুন",
        submit: "জমা দিন",
        featuresHeading: "বৈশিষ্ট্য",
        smartRecommendations: "স্মার্ট সুপারিশ",
        realTimeData: "রিয়েল-টাইম ডেটা",
        localizedInsights: "স্থানীয় দৃষ্টিভঙ্গি",
        weeklyUsage: "সাপ্তাহিক ব্যবহার",
        contactHeading: "যোগাযোগ করুন",
        nameLabel: "নাম",
        emailLabel: "ইমেল",
        messageLabel: "বার্তা",
        sendMessage: "বার্তা পাঠান",
        aboutUsHeading: "আমাদের সম্পর্কে",
        aboutUsText: "হাইড্রোহ্যাকার্স জল ব্যবহার দক্ষতা উন্নত করতে নিবেদিত। আমাদের অ্যাপটি উন্নত প্রযুক্তি ব্যবহার করে আপনাকে টেকসই পছন্দ করতে সহায়তা করে।",
        footerText: "&copy; ২০২৪ হাইড্রোহ্যাকার্স। সমস্ত অধিকার সংরক্ষিত।"
    },
    ta: {
        home: "முகப்பு",
        features: "அம்சங்கள்",
        contact: "தொடர்பு கொள்ள",
        about: "எங்களை பற்றி",
        languages: "மொழிகள்",
        bannerHeading: "நீர்வானாவிற்கு வரவேற்கிறோம்",
        bannerText: "எங்கள் நவீன பயன்பாட்டுடன் உங்கள் தண்ணீர் பயன்பாட்டை எளிதாக கண்காணிக்கவும் மேம்படுத்தவும் செய்யுங்கள்.",
        analyzeProduct: "தயாரிப்பு பகுப்பாய்வு",
        productInputHeading: "தயாரிப்பு உள்ளீடு",
        selectProductType: "தயாரிப்பு வகையைத் தேர்வுசெய்க",
        enterProductName: "தயாரிப்பு பெயரை உள்ளிடவும்",
        enterWeight: "கிலோகிராம்களில் எடையை உள்ளிடவும்",
        submit: "சமர்ப்பிக்கவும்",
        featuresHeading: "அம்சங்கள்",
        smartRecommendations: "சார்வசான்கள்",
        realTimeData: "உண்மையான நேரம் தரவுகள்",
        localizedInsights: "உள்ளூர் பார்வைகள்",
        weeklyUsage: "வாராந்திர பயன்பாடு",
        contactHeading: "தொடர்பு கொள்ள",
        nameLabel: "பெயர்",
        emailLabel: "மின்னஞ்சல்",
        messageLabel: "செய்தி",
        sendMessage: "செய்தியை அனுப்பவும்",
        aboutUsHeading: "எங்களை பற்றி",
        aboutUsText: "ஹைட்ரோஹாக்கர்ஸ் நீர் பயன்பாட்டு திறனை மேம்படுத்துவதற்காக அர்ப்பணிக்கப்பட்டுள்ளது. நாங்கள் மேம்பட்ட தொழில்நுட்பங்களைப் பயன்படுத்தி உங்களுக்கு நிலைத்தன்மை உள்ள தேர்வுகளைச் செய்ய உதவுகிறோம்.",
        footerText: "&copy; 2024 ஹைட்ரோஹாக்கர்ஸ். எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },
    mr: {
        home: "मुख्यपृष्ठ",
        features: "वैशिष्ट्ये",
        contact: "संपर्क करा",
        about: "आमच्या विषयी",
        languages: "भाषा",
        bannerHeading: "नीरवाणामध्ये आपले स्वागत आहे",
        bannerText: "आमच्या नाविन्यपूर्ण अ‍ॅपसह आपल्या पाण्याचा वापर सहजपणे ट्रॅक करा आणि ऑप्टिमाइझ करा.",
        analyzeProduct: "उत्पादनाचे विश्लेषण करा",
        productInputHeading: "उत्पादन इनपुट",
        selectProductType: "उत्पादन प्रकार निवडा",
        enterProductName: "उत्पादनाचे नाव प्रविष्ट करा",
        enterWeight: "किलोग्राममध्ये वजन प्रविष्ट करा",
        submit: "प्रस्तुत करा",
        featuresHeading: "वैशिष्ट्ये",
        smartRecommendations: "स्मार्ट शिफारसी",
        realTimeData: "रिअल-टाइम डेटा",
        localizedInsights: "स्थानिक अंतर्दृष्टी",
        weeklyUsage: "साप्ताहिक वापर",
        contactHeading: "संपर्क करा",
        nameLabel: "नाव",
        emailLabel: "ईमेल",
        messageLabel: "संदेश",
        sendMessage: "संदेश पाठवा",
        aboutUsHeading: "आमच्या विषयी",
        aboutUsText: "हायड्रोहॅकर्स पाण्याच्या वापराची कार्यक्षमता सुधारण्यासाठी समर्पित आहे. आमचे अ‍ॅप उन्नत तंत्रज्ञानाचा वापर करून आपल्याला टिकाऊ निवडी करण्यात मदत करते.",
        footerText: "&copy; २०२४ हायड्रोहॅकर्स. सर्व हक्क राखीव."
    }
};



// Function to translate content based on selected language
function translateContent(lang) {
    document.getElementById("nav-home").textContent = translations[lang].home;
    document.getElementById("nav-features").textContent = translations[lang].features;
    document.getElementById("nav-contact").textContent = translations[lang].contact;
    document.getElementById("nav-about").textContent = translations[lang].about;
    document.getElementById("nav-languages").textContent = translations[lang].languages;

    document.querySelector(".banner-content h1").textContent = translations[lang].bannerHeading;
    document.querySelector(".banner-content p").textContent = translations[lang].bannerText;
    document.getElementById("prod").textContent = translations[lang].analyzeProduct;

    document.querySelector("#product-popup h2").textContent = translations[lang].productInputHeading;
    document.querySelector("label[for='product-type']").textContent = translations[lang].selectProductType;
    document.getElementById("product-name").placeholder = translations[lang].enterProductName;
    document.querySelector("label[for='product-weight']").textContent = translations[lang].enterWeight;
    document.querySelector("#product-popup button[type='submit']").textContent = translations[lang].submit;

    document.getElementById("features").querySelector("h2").textContent = translations[lang].featuresHeading;
    document.querySelectorAll(".feature-card")[0].querySelector("h3").textContent = translations[lang].smartRecommendations;
    document.querySelectorAll(".feature-card")[1].querySelector("h3").textContent = translations[lang].realTimeData;
    document.querySelectorAll(".feature-card")[2].querySelector("h3").textContent = translations[lang].localizedInsights;
    document.querySelectorAll(".feature-card")[3].querySelector("h3").textContent = translations[lang].weeklyUsage;

    document.getElementById("contact").querySelector("h2").textContent = translations[lang].contactHeading;
    document.querySelector("label[for='name']").textContent = translations[lang].nameLabel;
    document.querySelector("label[for='email']").textContent = translations[lang].emailLabel;
    document.querySelector("label[for='message']").textContent = translations[lang].messageLabel;
    document.querySelector(".contact-form button[type='submit']").textContent = translations[lang].sendMessage;

    document.getElementById("about").querySelector("h2").textContent = translations[lang].aboutUsHeading;
    document.getElementById("about").querySelector("p").textContent = translations[lang].aboutUsText;

    document.querySelector("footer p").innerHTML = translations[lang].footerText;
}

// Event listeners for language selection
document.getElementById("lang-en").addEventListener("click", function() {
    translateContent("en");
});

document.getElementById("lang-hi").addEventListener("click", function() {
    translateContent("hi");
});


document.getElementById("lang-en").addEventListener("click", function() {
    translateContent("en");
});

document.getElementById("lang-hi").addEventListener("click", function() {
    translateContent("hi");
});

document.getElementById("lang-bn").addEventListener("click", function() {
    translateContent("bn");
});

document.getElementById("lang-ta").addEventListener("click", function() {
    translateContent("ta");
});

document.getElementById("lang-mr").addEventListener("click", function() {
    translateContent("mr");
});

