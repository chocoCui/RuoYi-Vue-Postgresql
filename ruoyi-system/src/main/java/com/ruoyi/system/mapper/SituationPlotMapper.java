package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.PlotIconManagement;
import com.ruoyi.system.domain.SituationPlot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SituationPlotMapper {

    List<SituationPlot> selectPlot(@Param("eqid") String eqid);

    int addPlot(SituationPlot sp);

    int addPlotMore(List<SituationPlot> spM);

    int deletePlot(@Param("id") String id);

    int addPlotIcon(PlotIconManagement pim);

    int deletePlotIcon(@Param("id") String id);

    int updataPlotIcon(PlotIconManagement pim);

    List<PlotIconManagement> selectPlotIcon();


}
