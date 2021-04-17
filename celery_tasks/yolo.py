import logging
import torch
import matplotlib.pyplot as plt


class YoloModel:
    def __init__(self):
        self.model = torch.hub.load('ultralytics/yolov5', 'yolov5x', pretrained=True)
        self.model.eval()

    def predict(self, img):
        try:
            with torch.no_grad():
                result = self.model(img)
            result.save('api/static/results/')
            final_result = {}
            data = []
            file_name = f'static/{result.files[0]}'

            for i in range(len(result.xywhn[0])):
                x, y, w, h, prob, cls = result.xywhn[0][i].numpy()
                preds = {}
                preds['x'] = str(x)
                preds['y'] = str(y)
                preds['w'] = str(w)
                preds['h'] = str(h)
                preds['prob'] = str(prob)
                preds['class'] = result.names[int(cls)]
                data.append(preds)

            return {'file_name': file_name, 'bbox': data}
        except Exception as ex:
            logging.error(str(ex))
            return None
