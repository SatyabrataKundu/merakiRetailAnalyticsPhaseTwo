FROM python:3

RUN mkdir /WeaponDetection

COPY . /WeaponDetection/
ADD requirements.txt ./

RUN pip install -r requirements.txt

WORKDIR /WeaponDetection/research/object_detection/


CMD [ "python", "./flaskApi.py" ]