FROM python:3

RUN mkdir /predict

COPY . /predict/

ADD requirements.txt ./

RUN pip install -r requirements.txt

WORKDIR /predict/

RUN chmod 644 PredictionAnalysis.ipynb

ENTRYPOINT [ "runipy" ]

CMD [ "PredictionAnalysis.ipynb" ]
