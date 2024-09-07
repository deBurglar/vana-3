from django.db import models

# Create your models here.

class Product(models.Model):

    # choices = [
    #     ('Vegetables','VEGETABLES'),
    #     ('Pulses','PULSES'),
    #     ("OilCrops",'OILCROPS'),
    #     ('Cereals','CEREALS'),
    #     ('Stimulantas','STIMULANTAS'),
    #     ('Spices','SPICES'),
    #     ('Fibres','FIBRES'),
    #     ('Fodder Crops','FODDER CROPS'),
    #     ('Nuts','NUTS'),
    #     ('Roots','ROOTS'),
    #     ('Sugar Crops','SUGAR CROPS'),
    #     ('Others','OTHERS')
        
    #]

    quantity = models.IntegerField(default=1)
    District = models.CharField(max_length=100,default=-1.70846)	
    crop = models.CharField(max_length=200,default=0.695206)	
    typesofsoil	= models.CharField(max_length=100,default=0.0)
    avrainfall = models.IntegerField(default=125)
    harvarea_ha	= models.FloatField(default=4.340878e+07)
    irrigated_harvarea_fraction = models.FloatField(default=0.61)	
    production_t = models.FloatField(default=1.382677e+08)
    crop_yield_t_ha	= models.FloatField(default=4)
    wfg_m3_t = models.FloatField(default=500)
    wfb_cr_m3_t	= models.FloatField(default=60)
    wfb_i_m3_t = models.FloatField(default=750)


    #product_category = models.CharField(max_length=25,choices=choices)
   # audio_file = models.FileField(upload_to='media/audio/',blank=True)

    def __str__(self):
        return f"{self.product_name} - {self.quantity}"
    

# class AgricultureProduct(models.Model):
#     product = models.CharField(max_length=25)
#     quantity = models.IntegerField(default=1)


#     def __str__(self):
#         return f"{self.product} - {self.quantity}"
