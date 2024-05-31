package com.ruoyi.web.controller.system;

import com.ruoyi.system.domain.PlotIconManagement;
import com.ruoyi.system.domain.SituationPlot;
import com.ruoyi.system.service.SituationPlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/addploticon")
    public int addPlotIcon(@RequestBody PlotIconManagement pim){
        int data = situationPlotService.addPlotIcon(pim);
        return data;
    }
    @GetMapping("/deleteploticon")
    public int deletePlotIcon(String id){
        int data = situationPlotService.deletePlotIcon(id);
        return data;
    }
    @PostMapping("/updataploticon")
    public int updataPlotIcon(@RequestBody PlotIconManagement pim){
//        System.out.println(pim.getId());
        int data = situationPlotService.updataPlotIcon(pim);
        return data;
    }
    @GetMapping("/getploticon")
    public List<PlotIconManagement>selectPlotIcon(){
        List<PlotIconManagement> plotIcon = situationPlotService.selectPlotIcon();
        return plotIcon;
    }

}
