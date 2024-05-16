package com.ruoyi.system.service.impl;

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
}
