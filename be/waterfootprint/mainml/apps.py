from django.apps import AppConfig
import pickle

class MainmlConfig(AppConfig):
    #default_auto_field = 'django.db.models.BigAutoField'
    name = 'mainml'
    model = None
    def ready(self):
        # Load your pickle model when the app starts
        with open('C:/Users/Hp/Desktop/random_forest_model2.pkl', 'rb') as model_file:
            MainmlConfig.model = pickle.load(model_file)


