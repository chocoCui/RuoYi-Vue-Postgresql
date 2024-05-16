package com.ruoyi.system.service;

import com.ruoyi.system.domain.SituationPlot;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface SituationPlotService {

    public List<SituationPlot> selectPlot(String eqid);
}
