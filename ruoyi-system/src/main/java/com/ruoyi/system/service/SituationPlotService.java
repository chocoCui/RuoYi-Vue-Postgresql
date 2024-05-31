package com.ruoyi.system.service;

import com.ruoyi.system.domain.PlotIconManagement;
import com.ruoyi.system.domain.SituationPlot;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface SituationPlotService {

    public List<SituationPlot> selectPlot(String eqid);

    public int addPlotIcon(PlotIconManagement pim);

    public int deletePlotIcon(String id);

    public int updataPlotIcon(PlotIconManagement pim);

    public List<PlotIconManagement>selectPlotIcon();
}
