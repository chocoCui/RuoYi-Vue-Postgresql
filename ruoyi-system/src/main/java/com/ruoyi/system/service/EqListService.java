package com.ruoyi.system.service;

import com.ruoyi.system.domain.EqList;

import java.util.List;

public interface EqListService {
    public int addEq(EqList eq);
    public int deleteEq(String eqid);
    public int updataEq(EqList eq);
    public List<EqList> selectAllEq();

}
