import React, { useState } from 'react'
import uploadFile from '../utils/uploadImages';
import { toast } from 'react-toastify';
import { PlusOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons";
import { Image, Upload } from 'antd';

export default function DemoUpload() {


    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => {
          console.log(error);
          reject(error);
        };
      });
    };
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    };
  
    const handleChange = async ({ fileList: newFileList }) => {
        
      const updatedFileList = await Promise.all(
        newFileList.map(async (file) => {
          if (file.status !== "done") {
            try {
              const url = await uploadFile(file.originFileObj); // Upload the file and get the URL
              toast.success("Upload Success");
            
              return { ...file, url, status: "done" }; // Update the file status and add the URL
            } catch (error) {
              console.error("Upload failed", error);
              return { ...file, status: "error" }; // Set status to error on failure
            }
          }
          return file; // Keep already uploaded files as-is
        })
      );
      setFileList(updatedFileList);
    };
  
    const uploadButton = (
      <div>
        <StarOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
  return (
    <div><div>
    <h1>UPloadadddddd demooooo</h1>
    <Upload
  className="label-form-image"
  maxCount={2}
  listType="picture-card"
  fileList={fileList}
  onPreview={handlePreview}
  onChange={handleChange}
>
  {fileList.length >= 2 ? null : uploadButton}
</Upload>
{previewImage && (
  <Image
    wrapperStyle={{
      display: "none",
    }}
    preview={{
      visible: previewOpen,
      onVisibleChange: (visible) => setPreviewOpen(visible),
      afterOpenChange: (visible) => !visible && setPreviewImage(""),
    }}
    src={previewImage}
  />
)}
</div></div>
  )
}
