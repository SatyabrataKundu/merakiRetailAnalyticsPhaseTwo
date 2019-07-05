FROM python:3

RUN mkdir /predict

COPY . /predict/

ADD requirements.txt ./

RUN pip install -r requirements.txt

WORKDIR /predict/

RUN chmod 644 PredictionAnalysis.py

#ENTRYPOINT [ "python" ]

#CMD [ "PredictionAnalysis.py" ]
