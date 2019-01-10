package com.pinyougou.pojo;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

//分页结果集封装的对象
//因为数据要在网络中传输索引要实现Serializable接口
@Data
@ToString
public class PageResult implements Serializable {
    private long total; //总记录数
    private List size; //当前页的结果


    public PageResult(long total, List size) {
        this.total = total;
        this.size = size;
    }
}
