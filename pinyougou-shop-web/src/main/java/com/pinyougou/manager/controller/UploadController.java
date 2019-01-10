package com.pinyougou.manager.controller;

import com.pinyougou.pojo.Result;
import com.pinyougou.utils.FastDFSClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

//文件上传
@RestController
public class UploadController {

    //读取配置文件
    @Value("${FILE_SERVER_URL}")
    private String FILE_SERVER_URL; //文件服务器地址，只是为了和返回的服务器的图片地址进行拼接一下

    @RequestMapping("/upload")
    public Result upload(MultipartFile file) {

        //获取文件的扩展名
        String filename = file.getOriginalFilename();

        //获得文件的后缀名，根据 .来截取+1，不要 这个 【点.】
        String extName = filename.substring(filename.lastIndexOf(".") + 1);
        try {
            FastDFSClient client = new FastDFSClient("classpath:config/fdfs_client.conf");

            //文件的字节数组，文件的后缀名
            String uploadFileId = client.uploadFile(file.getBytes(), extName);
            String url = FILE_SERVER_URL + uploadFileId;//和返回的服务器的图片地址进行拼接得到的就是具体的URL地址
            return new Result(true, url);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"上传失败");
        }
    }
}
