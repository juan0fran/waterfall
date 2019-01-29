FROM ubuntu:18.04
MAINTAINER Yan Grunenberger <yan@grunenberger.net>
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get -yq dist-upgrade
RUN apt-get -qy install gnuradio gr-osmosdr
WORKDIR /root
COPY . /root
EXPOSE 8000
ENTRYPOINT ["python","server.py"]