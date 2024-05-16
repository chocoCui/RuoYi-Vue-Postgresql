package com.ruoyi.system.domain;

public class SituationPlot {
    private String eqid;
    private String timestamp;
    private String drawtype;
    private String latitude;
    private String longitude;
    private String drawid;
    private String pointtype;
    private String pointdescribe;
    private String pointname;
    private String height;
    private String img;


    public String getEqid() {
        return eqid;
    }

    public void setEqid(String eqid) {
        this.eqid = eqid;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getDrawtype() {
        return drawtype;
    }

    public void setDrawtype(String drawtype) {
        this.drawtype = drawtype;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getDrawid() {
        return drawid;
    }

    public void setDrawid(String drawid) {
        this.drawid = drawid;
    }

    public String getPointtype() {
        return pointtype;
    }

    public void setPointtype(String pointtype) {
        this.pointtype = pointtype;
    }

    public String getPointdescribe() {
        return pointdescribe;
    }

    public void setPointdescribe(String pointdescribe) {
        this.pointdescribe = pointdescribe;
    }

    public String getPointname() {
        return pointname;
    }

    public void setPointname(String pointname) {
        this.pointname = pointname;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    @Override
    public String toString() {
        return "SituationPlot{" +
                "eqid='" + eqid + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", drawtype='" + drawtype + '\'' +
                ", latitude='" + latitude + '\'' +
                ", longitude='" + longitude + '\'' +
                ", drawid='" + drawid + '\'' +
                ", pointtype='" + pointtype + '\'' +
                ", pointdescribe='" + pointdescribe + '\'' +
                ", pointname='" + pointname + '\'' +
                ", height='" + height + '\'' +
                ", img='" + img + '\'' +
                '}';
    }

}
