package com.ruoyi.web.controller.system;

import com.ruoyi.system.domain.SituationPlot;
import com.ruoyi.system.service.SituationPlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/system/ploy")
public class SituationPlotController {

    @Autowired
    private SituationPlotService situationPlotService;
    @GetMapping("/geteqploy")
    public List<SituationPlot> getPloy(String id){
        List<SituationPlot> plotData = situationPlotService.selectPlot(id);
        return plotData;
    }
}
