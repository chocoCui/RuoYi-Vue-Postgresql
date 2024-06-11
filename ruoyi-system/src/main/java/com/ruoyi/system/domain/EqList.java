package com.ruoyi.system.domain;

public class EqList {
    private String eqid;
    private String position;
    private String time;
    private String magnitude;
    private String longitude;
    private String latitude;
    private String depth;

    public String getEqid() {
        return eqid;
    }
    public void setEqid(String eqid) {
        this.eqid = eqid;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(String magnitude) {
        this.magnitude = magnitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getDepth() {
        return depth;
    }

    public void setDepth(String depth) {
        this.depth = depth;
    }

    @Override
    public String toString() {
        return "EqList{" +
                "eqid='" + eqid + '\'' +
                ", position='" + position + '\'' +
                ", time='" + time + '\'' +
                ", magnitude='" + magnitude + '\'' +
                ", longitude='" + longitude + '\'' +
                ", latitude='" + latitude + '\'' +
                ", depth='" + depth + '\'' +
                '}';
    }
}
