package com.ruoyi.system.service.impl;

import com.ruoyi.system.domain.PlotIconManagement;
import com.ruoyi.system.domain.SituationPlot;
import com.ruoyi.system.mapper.SituationPlotMapper;
import com.ruoyi.system.service.SituationPlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SituationPlotServiceImpl implements SituationPlotService {

    @Autowired
    private SituationPlotMapper situationPlotMapper;

    @Override
    public List<SituationPlot> selectPlot(String eqid){
        return situationPlotMapper.selectPlot(eqid);
    }
    @Override
    public int addPlotIcon(PlotIconManagement pim){
        return situationPlotMapper.addPlotIcon(pim);
    }
    @Override
    public List<PlotIconManagement>selectPlotIcon(){
        return situationPlotMapper.selectPlotIcon();
    }
    @Override
    public int updataPlotIcon(PlotIconManagement pim){
        return situationPlotMapper.updataPlotIcon(pim);
    }
    @Override
    public int deletePlotIcon(String id){
        return situationPlotMapper.deletePlotIcon(id);
    }

}
