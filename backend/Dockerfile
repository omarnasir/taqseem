FROM python:3.11.7-slim-bookworm as base

ENV PORT="8000" \
    # Keeps Python from generating .pyc files in the container
    PYTHONDONTWRITEBYTECODE=1 \
    # Turns off buffering for easier container logging
    PYTHONUNBUFFERED=1

# install system dependencies
RUN apt-get update \
  && apt-get -y install gcc \
  && apt-get clean

WORKDIR /backend

# Install python dependencies
COPY ./requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip \
    && pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# Copy entrypoint
COPY ./entrypoint.sh /backend/entrypoint.sh
RUN chmod +x /backend/entrypoint.sh 

FROM base as prod
# Copy project
COPY ./app /backend/app
EXPOSE ${PORT}
CMD ["bash", "/backend/entrypoint.sh"]

FROM base as dev
# Dont copy project because we will mount it
EXPOSE ${PORT}
CMD ["bash", "/backend/entrypoint.sh"]
