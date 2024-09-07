from django.shortcuts import render
from .models import Product
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import speech_recognition as sr
import re
import os
# from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
# from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
from django.core.files.storage import FileSystemStorage

def home(request):
    return render(request, 'index.html')

@csrf_exempt
def Products(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            quantity = data.get('quantity',1)
            District = data.get('District','Unknown')
            crop = data.get('crop','Unknown')
            typesofsoil =  data.get('typesofsoil','Unknown')
            avrainfall = data.get('avrainfall',125)
            harvarea_ha = data.get('harvarea_ha',4.34e+07)
            irrigated_harvarea_fraction = data.get('irrigated_harvarea_fraction', 0.61)
            production_t = data.get('production_t',1.38e+08)
            crop_yield_t_ha = data.get('crop_yield_t_ha',4)
            wfg_m3_t = data.get('wfg_m3_t', 500)
            wfb_cr_m3_t = data.get('wfb_cr_m3_t',60)
            wfb_i_m3_t = data.get('wfb_i_m3_t', 750)

            

            product_instance = Product(quantity=quantity,District=District,crop=crop,typesofsoil=typesofsoil,avrainfall=avrainfall,harvarea_ha=harvarea_ha,irrigated_harvarea_fraction=irrigated_harvarea_fraction,production_t=production_t,crop_yield_t_ha=crop_yield_t_ha,wfg_m3_t=wfg_m3_t,wfb_cr_m3_t=wfb_cr_m3_t,wfb_i_m3_t=wfb_i_m3_t)
            product_instance.save()

            return JsonResponse({'message': 'Product created successfully!'}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    else:
        return JsonResponse({"Invalid request"}, status=400)
    


agriculture_product = ['apple', 'banana', 'orange', 'rice', 'wheat', 'corn', 'potato', 'tomato', 'onion']
@csrf_exempt
def recognize_speech_from_microphone():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=2)
        audio = recognizer.listen(source)

        try:
            speech_text = recognizer.recognize_google(audio)
            return speech_text.lower()
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            return None

def extract_product_and_quantity(text):
    quantity = re.search(r'\b\d+\b', text)
    quantity = quantity.group(0) if quantity else "unknown"

    found_product = None
    for product in Product:
        if product in text:
            found_product = product
            break

    return found_product, quantity

# Django view to process speech input and store data in SQLite
def process_speech(request):
    if request.method == "POST":
        speech_text = recognize_speech_from_microphone()
        
        if speech_text:
            product, quantity = extract_product_and_quantity(speech_text)
            if product:
                # Insert into SQLite database using Django ORM
                Product.objects.create(product=product, quantity=quantity)
                return JsonResponse({'product': product, 'quantity': quantity})
            else:
                return JsonResponse({'error': 'No known agricultural product found.'}, status=400)
        else:
            return JsonResponse({'error': 'Speech could not be recognized.'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)



#image recognition

# # Load the pre-trained MobileNetV2 model for feature extraction
# model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')

# # Load and preprocess the dataset images
# dataset_dir = 'C:\Users\Hp\Desktop\\real\waterfootprint\\neervana\\validation'
# dataset_images = []
# dataset_labels = []

# for img_name in os.listdir(dataset_dir):
#     img_path = os.path.join(dataset_dir, img_name)
#     img_array = image.load_img(img_path, target_size=(224, 224))
#     img_array = image.img_to_array(img_array)
#     img_array = np.expand_dims(img_array, axis=0)
#     img_array = preprocess_input(img_array)
#     features = model.predict(img_array)
#     dataset_images.append(features)
#     dataset_labels.append(img_name)

# # Function to recognize agricultural products in a frame
# def recognize_agricultural_product(img_array, similarity_threshold=0.5):
#     # Extract features from the frame
#     frame_features = model.predict(img_array)
    
#     # Compare frame features with dataset features using cosine similarity
#     similarities = []
#     for dataset_img_features in dataset_images:
#         similarity = cosine_similarity(frame_features, dataset_img_features)
#         similarities.append(similarity[0][0])
    
#     # Find the most similar product from the dataset
#     best_match_idx = np.argmax(similarities)
#     best_match_similarity = similarities[best_match_idx]
    
#     # Check if the best match exceeds the similarity threshold
#     if best_match_similarity >= similarity_threshold:
#         best_match_label = dataset_labels[best_match_idx]
#     else:
#         best_match_label = "Not Detected"
    
#     return best_match_label

# @csrf_exempt
# def detect_product(request):
#     if request.method == 'POST' and request.FILES['image']:
#         image_file = request.FILES['image']
#         fs = FileSystemStorage()
#         filename = fs.save(image_file.name, image_file)
#         image_path = fs.path(filename)
        
#         # Preprocess the image
#         img = image.load_img(image_path, target_size=(224, 224))
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array = preprocess_input(img_array)

#         # Recognize the agricultural product in the image
#         product_name = recognize_agricultural_product(img_array)
        
#         # Insert detected product into the database
#         if product_name != "Not Detected":
#             Detection.objects.create(product_name=product_name)
        
#         # Return the detected product name
#         return JsonResponse({"product_name": product_name})
    
#     return JsonResponse({"error": "Invalid request"}, status=400)