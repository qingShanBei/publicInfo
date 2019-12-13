<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Net;
using System.Diagnostics;

public class Handler : IHttpHandler
{
    public string basePath = System.Web.HttpContext.Current.Server.MapPath(".");
    public int uploadThreads;
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        context.Response.ContentEncoding = System.Text.Encoding.UTF8;
        if (context.Request["REQUEST_METHOD"] == "OPTIONS")
        {
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            context.Response.AddHeader("Access-Control-Allow-Methods", "Post, Get, OPTIONS");
            context.Response.End();
        }
        string method = context.Request["method"];
        //用于生成文件夹
        string userID = string.IsNullOrEmpty(context.Request["userid"]) ? "" : context.Request["userid"];
        //获取前端http请求并发数
        uploadThreads = string.IsNullOrEmpty(context.Request["threads"]) ? 1 : Convert.ToInt32(context.Request["threads"]);
        //文件存放模块（文件夹）名
        string diskName = string.IsNullOrEmpty(context.Request["diskName"]) ? "PersonDisk" : context.Request["diskName"];
        //服务器存放地址
        if (basePath.EndsWith("/"))
        {
            basePath += diskName + "/Attach/";
        }
        else
        {
            basePath += "/" + diskName + "/Attach/";
        }
        string jsoncallback = context.Request["jsoncallback"];
        if (string.IsNullOrEmpty(method))
        {
            commonErrorFunc("参数不匹配。", jsoncallback);
        }
        else
        {
            string myParams = context.Request["params"];
            switch (method)
            {
                case "doUpload":
                    //进行文件上传操作（html5）
                    SaveFile(context, userID);
                    break;
                case "doUpload_Binary":
                    //进行文件上传操作（activeX）
                    SaveFileByBinary(context, userID);
                    break;
                case "doUpload_Mobile":
                    //进行文件上传操作（移动端）
                    SaveFileForMobile(context, userID);
                    break;
                case "downLoadFile":
                    //单个文件下载
                    DownLoadFile(myParams, jsoncallback);
                    break;
                case "packageDownload":
                    //批量打包下载
                    PackageDownload(myParams, userID);
                    break;
                case "doDelete":
                    //进行文件删除操作
                    DoDelete(myParams, userID, jsoncallback);
                    break;
                default:
                    //方法不存在
                    commonErrorFunc("方法不存在。", jsoncallback);
                    break;
            }
        }
    }
    
    /// <summary>
    /// 写文件（操作记录）
    /// </summary>
    /// <param name="strContent"></param>
    public void writeLogs(string strContent, string userID)
    {
        string path = basePath + userID + "_Log.txt";
        try
        {
            StreamWriter sw = File.AppendText(path);
            sw.Write(DateTime.Now.ToLocalTime() + ":" + strContent + "\r\n");
            sw.Close();
        }
        catch { }
    }

    /// <summary>
    /// 公共回调函数返回
    /// </summary>
    /// <param name="strError"></param>
    /// <param name="jsoncallback"></param>
    public void commonErrorFunc(string strError, string jsoncallback) 
    {
        string strJson = "{\"jsonrpc\" : \"2.0\", \"result\" : \"" + strError + "\", \"filePath\" : \"\"}";
        if (!string.IsNullOrEmpty(jsoncallback) && jsoncallback != "")
        {
            strJson = jsoncallback + "(" + strJson + ");";
        }
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 进行文件删除操作
    /// </summary>
    public void DoDelete(string filePath, string userID, string jsoncallback)
    {
        if (!filePath.Equals("")) 
        {
            string[] listPath = filePath.Split(',');
            for (int i = 0; i < listPath.Length; i++)
            {
                string eachPath = basePath + userID + "/" + Uri.UnescapeDataString(listPath[i]);
                if (eachPath.Equals("")) {
                    continue;
                }
                try
                {
                    if (File.Exists(eachPath))
                    {
                        File.Delete(eachPath);
                    }
                }
                catch { }
            }
        }
        string strJson = "{\"result\":\"true\"}";
        strJson = jsoncallback + "(" + strJson + ");";
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 进行文件上传操作（html5）
    /// </summary>
    /// <param name="context"></param>
    public void SaveFile(HttpContext context, string userID)
    {
        DateTime beginTime = DateTime.Now;
        string strJson = "";
        //生成完整文件名
        string fileName = System.Web.HttpContext.Current.Request["name"];
        //获取文件后缀
        string suffix = fileName.Substring((fileName.LastIndexOf(".") + 1)).ToLower();
        //为防止上传文件名称重复导致文件存储异常
        string guid = System.Web.HttpContext.Current.Request["Guid"];
        string fullName = guid + "." + suffix;
        string diyDicPath = basePath;
        if (!string.IsNullOrEmpty(userID))
        {
            diyDicPath = basePath + userID + "/";
        }
        HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
        int chunkSize = string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["chunkSize"]) ? 2 : Convert.ToInt32(System.Web.HttpContext.Current.Request["chunkSize"]); //分片大小
        //创建根文件夹
        if (!Directory.Exists(diyDicPath))
        {
            Directory.CreateDirectory(diyDicPath);
        }
        string fullPath = diyDicPath + fullName;
        int iNowChunk = string.IsNullOrEmpty(context.Request.Form["chunk"]) ? 0 : Convert.ToInt32(context.Request.Form["chunk"]);     //当前分片位置
        int totalChunk = string.IsNullOrEmpty(context.Request.Form["chunks"]) ? 0 : Convert.ToInt32(context.Request.Form["chunks"]);   //分片总数
        int isContinue = string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["isPaused"]) ? 0 : Convert.ToInt32(System.Web.HttpContext.Current.Request["isPaused"]);  //是否为暂停后继续上传操作

        //是否执行文件组合操作
        bool isPass = false;
        if (isContinue == 1)
        {
            if (File.Exists(fullPath))
            {
                //totalSize服务器存储文件大小
                int current_server_nowChunk = (int)(102400000000 / (chunkSize * 1024 * 1024));
                if (iNowChunk <= current_server_nowChunk - 1)
                {
                    //若传过来的片为服务器已经存储过的，则不进行组合（防止因暂停导致客户端传送重复文件块）
                    isPass = false;
                }
                else
                {
                    isPass = true;
                }
            }
            else { isPass = true; }
        }
        else
        {
            isPass = true;
        }
        if (true)
        {
            FileStream addFile = null;

            try
            {
                addFile = new FileStream(fullPath, FileMode.Append, FileAccess.Write);
                int l = Convert.ToInt32(files[0].InputStream.Length);
                byte[] bf = new byte[l];
                files[0].InputStream.Read(bf, 0, l);
                addFile.Write(bf, 0, bf.Length);
                addFile.Flush();

                strJson = "{\"result\" : \"true\", \"message\":\"\", \"filePath\" : \"" + fullName + "\"}";
            }
            catch (Exception e)
            {
                strJson = "{\"result\" : \"false\", \"message\":\"" + e.Message.Replace("\"", "“") + "\", \"filePath\" : \"" + fullName + "\"}";
                writeLogs(string.Format("错误内容:{0}", e.ToString()), userID);
            }
            if (addFile != null) { addFile.Close(); addFile.Dispose(); }
        }
        else
        {
            strJson = "{\"result\" : \"pass\", \"message\":\"\", \"filePath\" : \"" + fullName + "\"}";
        }
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 进行文件上传操作（activeX）
    /// </summary>
    /// <param name="context"></param>
    public void SaveFileByBinary(HttpContext context, string userID)
    {
        DateTime beginTime = DateTime.Now;
        string strJson = "";

        string suffix = System.Web.HttpContext.Current.Request["suffix"];
        string guid = context.Request["guid"];  //由客户端发送，作为文件唯一标识（在多用户上传的情况下）

        //string diyDicPath = basePath;
        //if (!string.IsNullOrEmpty(userID))
        //{
        //    diyDicPath = basePath + userID + "/";
        //}
        
        ////生成完整文件名
        //string fileName = System.Web.HttpContext.Current.Request["name"];
        ////获取文件后缀
        //string suffix = fileName.Substring((fileName.LastIndexOf(".") + 1)).ToLower();
        ////为防止上传文件名称重复导致文件存储异常
        //string guid = System.Web.HttpContext.Current.Request["Guid"];
        string fullName = guid + "." + suffix;
        string diyDicPath = basePath;
        if (!string.IsNullOrEmpty(userID))
        {
            diyDicPath = basePath + userID + "/";
        }
        HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
        int chunkSize = string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["chunkSize"]) ? 2 : Convert.ToInt32(System.Web.HttpContext.Current.Request["chunkSize"]); //分片大小
        //创建根文件夹
        if (!Directory.Exists(diyDicPath))
        {
            Directory.CreateDirectory(diyDicPath);
        }
        string fullPath = diyDicPath + fullName;
        int iNowChunk = string.IsNullOrEmpty(context.Request.Form["chunk"]) ? 0 : Convert.ToInt32(context.Request.Form["chunk"]);     //当前分片位置
        int totalChunk = string.IsNullOrEmpty(context.Request.Form["chunks"]) ? 0 : Convert.ToInt32(context.Request.Form["chunks"]);   //分片总数
        int totalBytes = System.Web.HttpContext.Current.Request.TotalBytes;
        byte[] bs = System.Web.HttpContext.Current.Request.BinaryRead(totalBytes);
        //是否执行文件组合操作
        bool isPass = false;

        if (File.Exists(fullPath))
        {
            //totalSize服务器存储文件大小
            int current_server_nowChunk = (int)(102400000000 / (chunkSize * 1024 * 1024));
            if (iNowChunk <= current_server_nowChunk - 1)
            {
                //若传过来的片为服务器已经存储过的，则不进行组合（防止因暂停导致客户端传送重复文件块）
                isPass = false;
            }
            else
            {
                isPass = true;
            }
        }
        else { isPass = true; }

        FileStream addFile = null;
        try
        {
            addFile = new FileStream(fullPath, FileMode.Append, FileAccess.Write);
            BinaryWriter addWrite = new BinaryWriter(addFile);
            addWrite.Write(bs);

            addWrite.Close();
            addFile.Close();
            addFile.Dispose();

            strJson = "{\"result\" : \"true\", \"message\":\"\", \"filePath\" : \"" + fullName + "\"}";
        }
        catch (Exception e)
        {
            strJson = "{\"result\" : \"false\", \"message\":\"" + e.Message.Replace("\"", "“") + "\", \"filePath\" : \"" + fullName + "\"}";
            writeLogs(string.Format("错误内容:{0}", e.ToString()), userID);
        }
        if (addFile != null) { addFile.Close(); addFile.Dispose(); }
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 移动端上传
    /// </summary>
    /// <param name="context"></param>
    /// <param name="userID"></param>
    public void SaveFileForMobile(HttpContext context, string userID)
    {
        string strJson = "1";
        DateTime startTime = DateTime.Now;
        string suffix = System.Web.HttpContext.Current.Request["suffix"];
        string guid = context.Request["guid"];  //由客户端发送，作为文件唯一标识（在多用户上传的情况下）

        string diyDicPath = basePath;
        if (!string.IsNullOrEmpty(userID))
        {
            diyDicPath = basePath + userID + "/";
        }

        string strBinary = "";
        byte[] bs;
        if(System.Web.HttpContext.Current.Request["strFileBinary"]!=null)
        {
            strBinary = System.Web.HttpContext.Current.Request["strFileBinary"].ToString();
            string[] strArrayBinary = strBinary.Split(',');
            bs = new byte[strArrayBinary.Length];
            //二进制字符串转二进制流
            for (int i = 0; i < strArrayBinary.Length; i++)
            {
                bs[i] = Convert.ToByte(strArrayBinary[i]);
            }
        }
        else 
        {
            Stream s = System.Web.HttpContext.Current.Request.InputStream;
            bs = new byte[(int)s.Length];
            s.Read(bs, 0, (int)s.Length);
        }
        
        //创建根文件夹
        if (!Directory.Exists(diyDicPath))
        {
            Directory.CreateDirectory(diyDicPath);
        }
        //生成完整文件名
        string fullName = guid + "." + suffix;
        //文件进行分片上传
        string strMessage = "";
        int iNowChunk = Convert.ToInt32(context.Request["chunk"]);     //当前分片位置
        int totalChunk = Convert.ToInt32(context.Request["chunks"]);   //分片总数
        string fullPath = diyDicPath + fullName;
        try
        {
            //if (!Directory.Exists(fullPath)) { Directory.CreateDirectory(fullPath); }
            FileStream addFile = new FileStream(fullPath, FileMode.Append, FileAccess.Write);
            BinaryWriter addWrite = new BinaryWriter(addFile);
            addWrite.Write(bs);

            addWrite.Close();
            addFile.Close();
            addFile.Dispose();
        }
        catch (Exception e)
        {
            strMessage = e.Message;
            strJson = "-1";
        }
        DateTime endTime = DateTime.Now;
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 下载文件
    /// </summary>
    /// <param name="fileName"></param>
    public void DownLoadFile(string strParams, string jsoncallback)
    { 
        string[] infoParams = strParams.Split('|');
        string ftpFileName = infoParams[0];
        long fileSize_down = 0;
        if (infoParams.Length == 3)
        {
            //客户端已下载的字节数
            fileSize_down = string.IsNullOrEmpty(infoParams[2]) ? 0 : Convert.ToInt64(infoParams[2]);
        }
        string url = basePath + ftpFileName;
        string strJson = "";
        if (!Directory.Exists(url))
        {
            System.Web.HttpContext.Current.Response.ContentType = "text/html";
            strJson = "<script>alert('文件不存在!')</script>";
        }
        else
        {
            //int chunkSize = 4 * 1024; //指定分块大小
            int chunkSize = 1000 * 1024; //指定分块大小
            byte[] buffer = new byte[chunkSize]; //缓冲区
            FileStream stream = null;
            try
            {
               string fileName = Uri.UnescapeDataString(infoParams[1]);
                // string fileName = "下载文件名";
                FileInfo[] fss = new DirectoryInfo(url).GetFiles();
                int fs = fss.Length;
                long totalLength = 20 * 1024 * 1024 * (fs - 1) + new FileInfo(string.Format("{0}\\{1}", url, fs - 1)).Length - fileSize_down;
                //获取从第几块分片文件开始
                int beginChunk = fileSize_down == 0 ? 0 : (int)(fileSize_down / (20 * 1024 * 1024));
                //需要过滤的字节数
                long filterLength = beginChunk == 0 ? fileSize_down : fileSize_down - beginChunk * 20 * 1024 * 1024;
                //设置公共http传输头
                string fileName_result = fileName.Replace(">", "_").Replace(" ", "").Replace(";", "；");
                string userAgent = System.Web.HttpContext.Current.Request.UserAgent.ToLower();
                fileName_result = userAgent.Contains("ie") || userAgent.Contains("edge") || userAgent.Contains("trident/7.0; rv:11.0") ? HttpUtility.UrlEncode(fileName_result, System.Text.Encoding.UTF8) : fileName_result;
                System.Web.HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName_result);
                System.Web.HttpContext.Current.Response.AddHeader("Content-Length", totalLength.ToString());
                System.Web.HttpContext.Current.Response.ContentType = "application/octet-stream";
                System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;

                for (int i = beginChunk; i < fs; i++)
                {
                    stream = new FileStream(url + "//" + i.ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                    if (i == beginChunk && filterLength != 0)
                    {
                        //过滤已下载字节
                        byte[] tempBuffer = new byte[filterLength];
                        stream.Read(tempBuffer, 0, (int)filterLength);
                        totalLength = stream.Length - filterLength;
                    }
                    else
                    {
                        totalLength = stream.Length;
                    }
                    while (totalLength > 0)
                    {
                        if (System.Web.HttpContext.Current.Response.IsClientConnected)
                        {
                            int length = stream.Read(buffer, 0, Convert.ToInt32(chunkSize));
                            HttpContext.Current.Response.OutputStream.Write(buffer, 0, length);
                            HttpContext.Current.Response.Flush();
                            //HttpContext.Current.Response.Clear();
                            totalLength -= length;
                        }
                        else
                        {
                            totalLength = -1;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Web.HttpContext.Current.Response.ContentType = "text/html";
                strJson = "<script>alert('" + e.Message + "')</script>";
            }
            finally
            {
                if (stream != null)
                {
                    stream.Close();
                }
                HttpContext.Current.Response.Close();
            }
        }
        System.Web.HttpContext.Current.Response.Write(strJson);
    }

    /// <summary>
    /// 文件打包下载
    /// </summary>
    /// <param name="strParams"></param>
    public void PackageDownload(string strParams, string userID)
    {
        bool rarResult = false;
        string strRarError = "";
        string strJson = "";
        int fileCount = 0;
        //需要压缩的文件数组（地址）
        string[] listPath = strParams.Split('|');
        //压缩exe执行文件路径
        string strRarExePath = System.Web.HttpContext.Current.Server.MapPath(".") + "/Winrar/Rar.exe";
        if (!File.Exists(strRarExePath))
        {
            writeLogs(strRarExePath + "文件不存在", userID + "_down");
        }
        //压缩文件存放地址
        DateTime iNow = DateTime.Now;
        string strRarName = string.Format("{0}{1}{2}{3}{4}{5}({6}).rar", iNow.Year.ToString(), iNow.Month.ToString(), iNow.Day.ToString(), iNow.Hour.ToString(), iNow.Minute.ToString(), iNow.Second.ToString(), userID);
        string strOutput = string.Format("{0}{1}", basePath, strRarName); 
        //命令行
        string strCmd = "\"" + strRarExePath + "\" a -as -k -m0 -s \"" + strOutput + "\" "; //只打包不压缩
        //添加需要打包的文件
        for (int i = 0; i < listPath.Length; i++)
        {
            string filePath = basePath + userID + "/" + listPath[i];
            if (File.Exists(filePath))
            {
                strCmd += "\"" + filePath + "\" ";
                fileCount++;
            }
        }
        if (fileCount == 0)
        {
            //无文件压缩
            System.Web.HttpContext.Current.Response.ContentType = "text/html";
            strJson = "<script>alert('文件不存在!（文件已失效或文件地址有误）')</script>";
            System.Web.HttpContext.Current.Response.Write(strJson);
        }
        else
        {
            try
            {
                Process prcss = new Process();
                prcss.StartInfo.FileName = strCmd;
                prcss.StartInfo.UseShellExecute = false;
                prcss.StartInfo.RedirectStandardInput = true;
                prcss.StartInfo.RedirectStandardOutput = true;
                prcss.StartInfo.CreateNoWindow = true;
                prcss.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
                prcss.Start();

                //string result = prcss.StandardOutput.ReadToEnd();
                prcss.StandardOutput.ReadToEnd();
                prcss.WaitForExit();
                prcss.Close();
                rarResult = true;
            }
            catch (Exception e)
            {
                strRarError = e.Message;
            }
            if (rarResult)
            {
                //打包成功，则向客户端输出
                int chunkSize = 4 * 1024; //指定分块大小
                byte[] buffer = new byte[chunkSize]; //缓冲区
                long totalLength = 0;
                FileStream stream = null;
                try
                {
                    string fileName = Uri.UnescapeDataString(strRarName);
                    stream = new FileStream(strOutput, FileMode.Open, FileAccess.Read, FileShare.Read);
                    totalLength = stream.Length;
                    //设置公共http传输头
                    string fileName_result = fileName.Replace(">", "_").Replace(" ", "").Replace(";", "；");
                    string userAgent = System.Web.HttpContext.Current.Request.UserAgent.ToLower();
                    fileName_result = userAgent.Contains("ie") || userAgent.Contains("edge") || userAgent.Contains("trident/7.0; rv:11.0") ? HttpUtility.UrlEncode(fileName_result, System.Text.Encoding.UTF8) : fileName_result;
                    System.Web.HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName_result);
                    System.Web.HttpContext.Current.Response.AddHeader("Content-Length", totalLength.ToString());
                    System.Web.HttpContext.Current.Response.ContentType = "application/octet-stream";
                    System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
                    while (totalLength > 0)
                    {
                        if (System.Web.HttpContext.Current.Response.IsClientConnected)
                        {
                            int length = stream.Read(buffer, 0, Convert.ToInt32(chunkSize));
                            HttpContext.Current.Response.OutputStream.Write(buffer, 0, length);
                            HttpContext.Current.Response.Flush();
                            HttpContext.Current.Response.Clear();
                            totalLength -= length;
                        }
                        else
                        {
                            totalLength = -1;
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Web.HttpContext.Current.Response.ContentType = "text/html";
                    strJson = "<script>alert('" + e.Message + "')</script>";
                    System.Web.HttpContext.Current.Response.Write(strJson);
                }
                finally
                {
                    if (stream != null)
                    {
                        stream.Close();
                        //删除临时压缩文件
                        if (File.Exists(strOutput))
                        {
                            File.Delete(strOutput);
                        }
                    }
                    HttpContext.Current.Response.Close();
                }
            }
            else
            {
                System.Web.HttpContext.Current.Response.ContentType = "text/html";
                strJson = "<script>alert('" + strRarError + "!')</script>";
                System.Web.HttpContext.Current.Response.Write(strJson);
            }
        }
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}