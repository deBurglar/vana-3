from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views import View
from .apps import MainmlConfig
from neervana.views import *
from django.views.decorators.csrf import csrf_exempt


class PredictView(View):
    @csrf_exempt
    def post(self, request):
        # Extract the input data from the request (assume JSON data)
        products = Product.objects.all()  # Assuming the input is a single string or value
        
        # Convert the data into the correct format if necessary
        # If it's a CSV, JSON, etc., you need to parse it accordingly

        input_data = []
        for product in products:
            # Assuming your model needs a structured input (e.g., name, category, quantity)
            input_data.append([product.quantity,product.District,product.crop,product.typesofsoil,product.avrainfall,product.harvarea_ha,product.irrigated_harvarea_fraction,product.production_t,product.crop_yield_t_ha,product.wfg_m3_t,product.wfb_cr_m3_t,product.wfb_i_m3_t])
        
        # Example for single prediction:
        prediction = MainmlConfig.model.predict(input_data)

        # Return the prediction result as JSON
        return JsonResponse({'prediction': prediction.tolist()})
