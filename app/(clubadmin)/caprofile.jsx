// app/clubadmin/caprofile.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CAProfileCard } from "../../components/CAProfileCard";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import EditPhotoModal from "../../components/EditPhotoModal";
import { BlurView } from "expo-blur";
import AmenitiesModal from "../../components/AmenitiesModal";
import LocationModal from "../../components/LocationModal";
import ContactInfoModal from "../../components/ContactInfoModal";
import CABreadcrumbs from "../../components/CABreadcrumbs";
import { useUser } from "../../hooks/useUser";

const AMENITIES_ICON_MAP = {
  "Parking": "car",
  "Lighting": "bulb",
  "Pro Shop": "storefront",
  "Coaching": "person",
  "Drinking Water": "water",
  "Cafeteria": "fast-food",
  "Free Wi-Fi": "wifi",
  "First Aid": "medkit",
  "Bike Rack": "bicycle",
  "Shaded Seating": "umbrella",
  "Indoor Court": "library",
  "Garden Area": "leaf",
  "Refreshments": "beer",
  "Locker Rooms": "bed",
};


export default function CAProfile() {
  const { user, accessToken } = useUser();
  useEffect(() => {
    console.log(process.env.EXPO_PUBLIC_API_URL);
    if (!accessToken) return; // wait until token is ready

    const fetchClubs = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/club/get-all-clubs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // ✅ add token here
          },
        });

        if (!response.ok) 
          {
            console.error(response)
            throw new Error("Failed to fetch clubs");
          }

        const data = await response.json();
        //console.log(data[0].image_url);
        setClubId(data[0]._id)
        setClubPhoto(data[0].image_url)
        setClubName(data[0].title)
        const normalizedAmenities = data[0].amenities.map(amenity => ({
          label: amenity,
          icon: AMENITIES_ICON_MAP[amenity] || "star" // provide default icon if not in API
        }));
        setAmenities(normalizedAmenities);
        setLocation({coords: data[0].location})
        //setClubs(data.data || []); // adjust based on your backend response shape
      } catch (err) {
        console.error("Error fetching clubs:", err);
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchClubs();
  }, [accessToken]);


  const updateClubField = async (fieldName, fieldValue) => {
    if (!accessToken || !clubId) {
      console.error("No access token available or Invalid Club Id");
      return;
    }
  
    try {
      const updatePayload = {
        _id: clubId, // Replace with actual club ID from your state/context
        [fieldName]: fieldValue,
      };
  
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/club/update-club`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to update ${fieldName}`);
      }
  
      const data = await response.json();
      console.log(`${fieldName} updated successfully`, data);
      return data;
    } catch (err) {
      console.error(`Error updating ${fieldName}:`, err);
      Alert.alert("Error", `Failed to update ${fieldName}`);
    }
  };
 
  const [clubId, setClubId] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [amenitiesModalVisible, setAmenitiesModalVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "+92 300 1234567",
    email: "info@elitepadel.com",
    website: "www.elitepadel.com",
  });
  
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const [clubPhoto, setClubPhoto] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nO2dB1xT5/7/T9t777+9vf319rb3ttU6AQcyVEBRQRygFvfAverAPeqoq0rrqHZYtxYXsiHsvUH2MJAQQhYjEGZICBmEDc//dbDLak4CcjgnyfN+vd6vV4fg5/s833NycsZzEAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBIIMAbIPPwUdFkNB28ohoO3o0O7WH4d2t7kN7W4NH9rdljm0u5UztLuNP6S7VYI6tLu1eWhPG0Ad0t3a8sd/bxMM7W5lD+1uy/j1Z58M7W69OhS0HR4K2lYMAx2WnwD5f+GQQyAEMAooPh7S2Wr/WVfL0aHdLW6fdbXmD+1qkX3W3QoG1a4WxdCu1ryh3S2PP+tqOfZZZ+v8EaD5E9gUEMhAAcDfhnUoLYd1tR36rLPVf1hna/WwrlZAZj/rbK0Y1tnqO6xLeXhIR8s0tAbYEBCIhgxpaxszrEN5aHhHS8zwDmXz8M4WoM0O61DKh3e0hA3vUO4f2dY2FjYCBPJnAHhrRGfr7BHtLbdHdCjLRnS0AN1WWT68XXl1WEeLDQLAm7AZIPoHAG+O6mixHdHecmtke0vdyPYWoKfWjWxruTf6+c7gDaKnBQLBFYOWlmEj25pdRrY1V45qUwLoH2MwsrWZN7Kt+evRLS3DYRtCdAcA3jJQKpcZtCgjDVqauwxalQCKMQYtzd2jW5Sxo9uaHeFXBIjWMhaI3jNUKg4ZKBXlhi3NAG8NlIoOA6WizFDZnGSgVDw0bGk+Z6hU7jZUylcatCpmjVYoTMa0to4aLpV+gGoGwLu/ZR3R1PRv9L+hn75Gra2j0T9r1CKfObpFsdZIqThoqFRcMlAq3AxbFLEGSgXfUKnoHoyaDJXNJegYjpZI3id2NiEQDRmrVA4xUiquGCmbm4yUzQAPDZsVfMNmRYiRUnHeUClfNbpNZoQeaQzWJH0GwDtGzc3mBi2K1YbNzed+zVKHV71GymapoVJxcYxc/tFg1QiB9IlRCsXHRnL59TFyeesYhQIMlEZyeecYhSLHSC7/2VAuXzmuuflTsk7N2KamkUYKxTp0HIzkcuoYubx7QMdCoWg2ksuvknkMIHrGOJnsw7EyxTdj5QrZWLkCDIgyuXCsTEExkjVvNpVKP0C0FPQTe6xC4TRGpnAdI5PXDtT4jJHJ28fI5TfQry5E1wjRUwwB+H/j5fKvxskUsnEyBRgAy8fKFFfGNTVP1slLYgC8OV4mmzpWKv95nFRePRBjNlaqEI+TKY6gc0F0eRA9YnyTfNm4JnnJeKkcvI7jmmTC8VL51QlSqRWiTwDw5tgmxazxUtn9cU3yxtcdx/FSebmxRLaE6LIgOo6pTDZ2gkSWOKFJDvqtRNZtLJHHG0sVTsYA/APRc9AxMG6UrjNukmW81rg2yYFxkzzCrKlpFNE1QXQMCwD+PkEiPW0ikbaaSGSgn8pNGqXXJ0ilBkTXQ1YmSCTmJhLZ/QkSWXN/x3mCRNoyQSL9Gp0zouuB6AATRFIrU7Gs0LRRBvqjSaO02rRResJcR05YOQHwlqlUOnqCWDrPTCLdYyqW/mQqlnmZNsri0HEyaZRVmYplkudKe34fB7FM2vv/GqUsk0ZZrqlYGmHaKLtl2ig7PqFRugYdZ4uamn+ifwc6ViZi6VlTsayx3+MulhWYSCRmRI8XREuxA+BvZqKmC6aipi4zsRT0WZG0ykwk3a3th/kThFIDU7Fki6mo6aaZqCnTVCxV9ms8NPD5WDdxTEVN/mYi6UnTRtnnZmLpOVNxU0P/5qCp3UwsPQuPBiB9YpJQamjW0JRrLpKCvttUZ9ogOTSCD97WxmE3lkr/Yy6SbTRvkLqbNUgr+zcGA2lTq1lD0zOzBqm0v7/DrKEpz7ReOprosYVoAWYNTdsm1jcpJgqbQF80FzYpzYVN3/x2GKtNWDQ0fDpJKDkwUShJMq+XdPa1dm3QvL5JZlYnXUP0WENIih2f//akeonbpPom0CfrJD2T6pp8LKsbhyHaVm+ddM2k+qaoiXWSrj7Xra3WSe5bCwTvED3+EBJhXtc00qJOkm9R1wT64uTaJqZFTeMMRItAd1STayVXJtdJGvtar+4ooU6pEn9G9FxASIBFjdjBorZRbFkrAZrb2G5ZK3ExZmrPCT7L6qZJFjUSf4uaxs6+1aqbWtRI6i1qJDZEzwuEQCyqGndZVjd2WtVIQB/MsaprnKAtE2dVK7W0qmkMt6pu7OljnXpgY7tVTeNOoucIMtgA8IZVlfj7KdWNQFOtqsSdVlWN36CXB7VhwqyqG8ZYVTWG9qVGzceiUTGlujHXqkrsM6Wq8bxVtXjr1KpGRwuBeIpFjWS4TaX0A9Q/P9OA/vv0StGQqVUNRujXpilV4lVWVeKDU6rEV62qxZFW1Y0l6BjjkVdtPdWNl3Ty+QvIq09+TRGI/adWNQLNFZdPq26crg3jaVUt+3CKoPHG1CpxR99qVKFA3DOlSsxAf6e1QLJhKl88Hq+Veszq6t6dWimxmVIlPozO0RRBo3BAatCozkZ3Cyq8e1CnsRMK/2VdKU62FoiB5ooCpvDE/4eQHQDesK4Ub7GuFIn6Vt/LThWImqZWir2sKxtXW9QQuAgHWpNAYjpFIDpmLRClW1eKul+3NjVzHYf2CGH1QvDDjt/0b+tKUda0SjHQROsKUZd1hei4Nhwaoof76I5N09peaYW4eVqFyH1qpdiBrJ+EU8vqP54mEO21rhRlv1atmIoytGKHD9Ecu5qaj2ZUiApmVIiAJk6vEDVMqxDNIf0YA/DGjArx/hl8UYumtb0kvyFvOl+4Vds++abxReOm8xt+nM5vkPS79gpVNuT2nsOAaD92nJqPbMobimzKRUATZ5Q1FNvx60YiJMe2ouHTGWWiWE3r+kuNXTblIoptiVArzmtg4VBX9+50vmj3jHIRtz9jYaNyjET56PkUouuDvOZhv02ZqMC2TAQ00aasIRn9GbIPum25eJ5NmUikaV1/qq/TtrTBw6asYQyiY6BPKc4sE623LWtg9nVcbFVLhV8HtBQ7pvBftqUNWTNLG4Am2pY2uJP+xh4A3rQtbThrWyLs0rSuXkuEPbalDZSZpQ1GiK4DwJt2JcJNM0uFgj6NUakqhanw1mEtvNRnxxMm25U0AE2cWSK8RvaTfegn0cwSYaSmNf2hMHdWqVCrblceCNCN1q5EeGpmSUNz38es4UV5wmjSfzhAnuOCfgJw6/1n8YRAE+14wotkHzv7sprhs3hChqY19cqtb7Lj1e9GxwPRY2aX146w4wrD+jR2vFf0CVfoTfYPCQg64dz672dzhUBDT5F90OzYIsvZ3PraPtQEZnPqA21ZDXDt/D8xiydcOZsjbOjTOHJfdBZXeJ64ToCoZQ6nfsdcTj3QxDns+tNkH1J7Vq3dHHadTPOa6mRz2fXOROcmKw6ldf+by64L0XQ85/5Vdl3PXK5wM9F1QF7BHFa9gz27rtOeXQ/UOZdVR/7Dfnb9EntWfasm9fTKqsuczyb/5UsyYM+qP6xpr9j/tXfY9e0OxbUzia4B8ifQxncorhc7sOqBWovrrpF98OYV161xYNV1alRPr3XXyXr3HpmPruxZ9ULNx/iF8a6fwxUPJboGCHq2N0vwjkNRXf48Zh1QpwOzzp3sJ3IcGDXL5zFrOzWpZx6zttmhqG4t0Zm1lXlF1cMcmHV5mo31X3upNsuJyYRXBohmXlGt2/yiOqBWRm0y2SdsAaPWcR6jrl2TeuYxamvtGbWWRGfWhUvG84tqH2nUQy9Ze4vo/HrNAkb1tgWMWqDO+YU1xUtpfFLf4Te/sMZ2QWFtqyb1LGDUFDkW144gOrMuMb+w5hvNxv5FPy+qhguNEsE8psDQkV6jcCysBdjWNMynkfvkmGNR7XhHem2j+lpqgSO9JnshoxI+qILHPBTWHXek1/RoNA+/+nlhbdMiZs1wPPJAVGCXAv62kFaTvZBeA7B0pFd3LaLVzCPzQM6nVny6kF7NV1fLr/U8XcIWvUd0Zl3GkVa1y5FW3a3JfPw+L7TqNCcKeIvo7HrDwoKaC4toNUC91ccREmOXwn97Ia06T5NaFhZUx6F/nujM+sBiWvXWhbTeDw+gsQU1J4nOrRcsKhBYLSqo6lpcUA0wza8OIPsZ/0X5VU/U1lFQDRYVVKcuomrfC0e0mYU0wYbF+VU9msxP7xzlV7cvpAtMiM6t0zhTqX9fQq2mL8mvBphSq8oX5JB7VZcl1KpDauvI792R5S7JgIf9RLA4v+qEJnP0p7nKgV8FcGQpter0Umo1wLaqc2leNakXuliWXz2tN6e6Wp5VlzgV1P4X0WH2gwL7A90FkQe6ae77QcHpA4BqTaYHmJZSq+6p77kX+u8w0Zl1kiV51WOXPqtqXfasCmC59FnVNwiJQS9HLntWxVdbR56gYXG+wBDRA/aC3E/2d9PC9nfTQK9dNNG+7gLPvZ0FS50A5S2iTzgvzRNEqpuv380TNC/N5pP6qpNWsjxHkLgitwpguTxXkINOGEJiVuQKKGrryKlqX0nyoxg82NdFc97XSevY10UDv7m3s6B8XxftxJeA+R+icjmlCP+1IreKqm7e/ujDqhCisuokK3IEy1bmCACWK7IF7StzK0n9xp4V2ZVb1dWBuiqncheip+zppM3e20Fr2NdJAy/YUSDf30H7ygUQczfnkozKIStyKhs0mb/efsyqtCcip86B3r67KquStypbADDNErggJGZtRuWQldkCibo6VmYL3BE9Z1crbeTeDhpvbwcN/NU9HQXcvZ35C4jI5ZQlWLAqq7JHbS+i85glYKEnrYnIqVOsyqr4yimrEmBbwST7ff5OWZURauvIrCjcAq/197Jdwfh4TxutYE87HbzSNvqTo4D+7qDPY2bFVfX9+NxVWRUHBjufTrEupeYjp4xK2erMSqDSjIqe1VkVpF7zbnVGxQbMGp7XoXRKqzAmOiuZcAbU93e30dJ3t9HBK22lF+9tpw3q1z4nJvMfqzMrqWrnM7N3hy5aksGGd272lzXp/O/XZFQANfogJMaJWvb+moyKOrV1pFfClXxU7AR2tdKou1t7N/iXbaEr97TQnAZzTtc9rTJak14h16A3wZr0irODmU1ncErhf7I2ja9cm14BVJrGV65JLRmGkJi1afzrmDWk9zZJDNE5yYyznPqRs5JevKuFDl6pkt7lrKQN6g50bTp/m7p5/VWpU5aAsCsYWsv6NP719WkVAMt1qXxSX/Nfm1Zmtj6N34ldQ4V8U3oZfJpMDbuUtKHOzfQaZyUdvNJmWo9zM+3EYL6WbX0qP11dj/aayr8yaLl0gc2JgqHrU8tbN6TygSrXp5bXOZP8/vj1T/lxWDX0+pS/l+ic2oKzkj7VWUFrdW5GN/hXu7OZfmowd/AbUvmdauc4la+ARwF9YEMK//uNKXyAaXL5QYTEbEjhz1JbQ0o51cWFPLe9agPbFbSNOxV0oFI5rWeHjLZ1sPJsTC6/pn6ee+f668HKpNVsy2C/tzGprGlTcjlQbVmNU5bgHYSsAPDGxuRyKlYNG5PLujek8K2JjqqNbJfR7+yQ04Eqt8voHTsVBfaD1q/JZdXY/dqrkNQ9SxY2J5Yf2pxUDrDclMjfjZCYLcllK9XVsDmx/BHRObUVJ5D1zjYpnbld1ruxq1K2Q0YflJegbkzkr1U738/nXG/v8NQIu5SUv21JLC3fklgGVJpQVu1EIfFNPwC8sSWxrACrhs2Jpcpt8ZVDiI6qzexopE3YLi1s2S4tBKqlM5wEWYPyqbsloTQXs2/ReU8o5ZB9jQpC2ZJYsmxrQhnANL508M709oMvEsoWqa0hoewy0Tl1gW1SxoltTYUAyy+aCm8ORpYtCWULNZh3sDWudM5g5NFKtsWVRW2LLwOq/CK+TL4lhdyr+34RV5qNXUOpZE8kXNRzIHAG1L9/IaEzvpAUApU20nu2SQqXIHgDwBtfxJU9w5r7X+efgnsWbWRHNO+z7XElXdvjSoFqS0j9Vp+dsSXTsfOXgu2xpeeIzqlLfCGmT90qpnd/0Yhu7Kqk1zlLqO/jnWV7HG+xuvnfFlvasS2eDb/+/ZUdsaUuO2JLgSq3x5Z0O0fzDBASsz22xAerhh2xpfLtsfCusIFmq6jw4VZxIcByi4h+HcEbAN7YHluar6YHwPaYEtK/lXpQQa+F74jmVe6MKQGq3BFdkoCQGOcY1qc7Y0rasWrYGV3yA9E5dZFtovwhm0WFyi0idENXYUNh16YG+iS8s+yIKVmK2QO9fcBj4p1Dq9gRw7V1ji4BmMaUDOoDH33FOZrngpk/qgQe+uHIpobC7zY3FAJs6ZkI3gDwhnMUr0RdP++I5E7EPYu2sCuCd3tXJA9gKDoQzft/CFlBJz2SV6amBj+iY+oy6Hf8zUK6eLOwEGC5qY6+CO8suyK4p9T0AnCO5H6Pdw6tAF1GeVc4t253BA9geBUhMbvDOHPU5Ae7I7i2ROfUdTbW01021RcCbOn5eF+L3xvJ/2R3OK8Dqx92RXAF8DZwdA24UPbsveFcgOWecI4VQmL2hnM9MWsI4xYRnVEfcBIw/7OxtlCxsY4BsKUvxjvLnjBOsLq+3hvKnYroO3vDuLf3hXGBSkM5ZWS+e8o5vOafe0O5zWpqOEJ0Tn1hY23hzY21DKDGfLxz7A3hOmL2RK+cC4i+sy+UU7o/lAtUGsL5DiExB0LZq7Dy7wvhdu6NZH5CdE59YWMdfdT66sLuDTUMgG0hrl/J0MP7/aHcCuze5hYi+sy+YNaYAyEcgOW+INZkhMTsD2H7qqkhguiM+sb6qsL49dUMgGkVA/el5NAPL3X9vTeweASirxwMZh86GMwBKg3i1JD58H+LG//tA0EcOVYNBwI5m4jOqW+sr2Y4ratiAGwL29eWMT7GM8ehYNY0zP5G+yOYswfRVw4FsmIOBbEBhg8REnMgiLNATf6OPZGMD4jOqW+gK/euFTCE6wQMgOXaSsYpvL8GHApk12P1yMEgtn5eHnZJSfnb4UC24nAgG6jyYCB7JUJiDgewr2HlPxTAgot9EsSaysKbayt7N3KVrqksZOOd43AAy01NjwjJfJSLG4cD2JZHKCygyi/9WZ2HQmikfvLvCIXFwqrhCKVYfw/vCMapnGG3poIB1LlaQDfBM8eXfuyV2D3CAod8i8Yj+sYRSvGho/4soMoj/qwchMScoDCHY+VHPeZbROqHl3QZ9BXjq8sLa9fwGQDbQlxXlj4eyn7vqF9xG3avFJN6hStcOObL9D/mVwww/BkhMcf8izdi5T/qV1xKdEZ9Z3VZ0b3V5UUAS6fyItxv0jrqVxyH2Su+TP17H+RxH2b1cd9ioMpj3kWk/v5/zJd5DzO/L/Me0Rn1ndVlRYudyoqAOteU4bt24HGf4q/V9Ip+PR14jML85CufYoDlaU/WpwiJOe7DZGDW4M1aS3RGfWcJm/3eytKijlWlRQBLp7IiXM/VHPMtmofVK8d9mN0uFOa/EH3hKx+GwwlvJlDlV15FfITEuHjy/u+EF7MLq4YTvuyRROeEIMgqHiNzVUkRwHIlj4HrpbiT3owPTngV9WD1yymvIlK/4HZAOenJPHLSiwlUecKrKAQhMae8GXZq8tcSnRHynJXcom9X8tCNXLUruIw6vC/FnfAq4mL2jCdTf14lftqD8eS0ZxFQqUfRtwiJOe3BOIiV/5RHUTDRGSHPWcEumr+Ci27k2DqxC8fiOWanPIu8MHvek3FXb+bsjHtR/hmPIqDKr58wVyEk5rQ74yFW/jPuDLjwJ0lYxmJ9uIJTBNS5nFO0A+8PDayeOe3OSEL0hTNPCmVfuzOAKk+6D84bXfrL108Kn2HlP/2EsZzojJA/WM4qKl/OLgJqvIXnmJ3xKJqO1TNnnjCq9GLOTrqzPjzrxgAYdjhRKG8hJOasW6EcqwaXR4zRRGeE/MFSVhFlGYsJsFxazHyK55i5eND/h9n3jwt7XG7rwZWAs08YFuceM4Aqzz5mlCEkBp1IrPznHjFa9PLebhKzhMk8t7S4dyNX6ZLiokZcQwDwxrlHjGas3vn6UZE5ouu4PCpc5fKoEKiWnoiQmLMPGdOw8p97WFhMdEbIiyxjMtctZTKBOpew8X1hB9obmL3/mOGo83P3zQP60W8eFgJVujwoJPUjwC4PCteryR9JdEbIiyxhMCyXFDGBOhczGA54jt03D+lRanoH1xORpOD8fdqP5x/QAYZnERLz7QP6Saz83z6gDcrLKCGa40Slvr+YgW7g2C5iML/Ac1y/vU+7i907dN2/enTBle524T4dqPL8A5ozQmLOu9KvYeW/4Er7iuiMkJdZTGdKFhcyAZaLCou+xnPszt+nncDs/fv0X3R+7i64FoRfdKUBVZ6/V0DqewAuuNK8sfJfvE/bSnRGyMsspDHZi+hMgCmNievNOBd+oa/B6p0LrrRQnZ+7i/doWZd+oQGVuhbYISTm0i8FSVj5L7oWfE50RsjLLKQVpS6kMQGWjrSiMDzH7pIrbTZm7/xSkKHzc/fdvXzOd/cKgCqvuFJNERJz6W4+HSv/xV/yLYnOCHkZx/yiAMcCJsA0n5mH59hdvE2biNU7l+4WMHR+7r67k191+U4BUOWFO3nDEBLz3e18Hlb+726R+y5GfcWRyrznmN+7kav083wmrmsEXrmTPx6zd27n8xBd58rt/IYrtwuAKn+8S/8fQmKu3Cqoxcp/8R5tKNEZIS+zgFp89XNqMcBywTNmBZ5j98MNqgFW71y5VSDQ+bn74Wa+9Idb+UCVV1yp7yNanP/aNXIvZKqvLHjGvLTgGbqRY5hXLMQzw0938oZh9c4Pt6gNiK7zw838lh9v5gNVXr2a9Q5CYn68SW3Hyn/jBolfY67HLMhjnluQ17uRq3R+HlOOZwb06Bard364QVUgus6P16ldP92gAlVSSP4g0I/XqR1Y+V1dqX8nOiPkZeblMk/Mzy0GauzEc+zQo0Os3vnpBhXXv58U/HSN2nX1OhWokuw7gJ+uUTuw8sMdADmZl808MS+nGGCaXdyBZwZXV+o/sXoH3TYQXefna89afr72DKiS7F8Brv6c14GV38WF+Q+iM0Jexj6L6eKQXQywtM9iyvAcO7S3sXrn52vPWnV+7q79nCe99vMzoFKSn0S79nNeO1Z+eA6AnNhnFn/nkFUMMM0srsczw08/UT/C6p2frz4TI7rO9Z9yG25czQOqvPtjJqkvA16/mivFzH85Hb4MlITYZxZftc8sBljOzWDiuhr1zR9zRmH1zvWrubhehiQFN3/Kq7r5Ux5Q5Z2fyH0j0M0f86qx8l+/Qh1OdEbIy8xNZ96bm4Fu5Kqdk16M641At65STbF65+ZPebq/lsStH3I5t37IAyq9Qu5bgdXlv/FjjjHRGSEvMye9OHBuOgtgOSeNheutwDeu5E3H7P0fcnN1fu5ufZ+Tefv7XKDKW5ezZyEk5tb3uVSs/Hev5FgTnRHyMrPTWGlz0no3cpXOTmXh+j6Km9/nLMPs/Su5yTo/d7cv54bduZILVHn7Sg6pHwe+fSU3Div/3e+zlxCdEfIys54Wc2an9m7kGBbfwXPsbl/J2YXVO3eu5Abq/NzdvZzz+O7lHKDKe1dydiEk5s7lbA+s/Hcv55B6QRN9ZVYKSzLrKQtgW3wGzwx3Lmd/g9U7dy5n47o0OSm4eyn7x3vf5QBV3v0um9RLgml7fn3EPqHs/VkpLKBOuxQ2rou53LuU44rZO5eycV2RiBS4Xso+6nopG6jyl0vZjxAS4/pdzjHM/BezdX9ZJy1jZkKRlV0yC6g1pdgezxy/XMpOwOod14tZur8oqOvF7JX3L2YDVbpezCL1K5LuX8pajZX//sXsBKIzQl5kZhJ7/cwkFlCnbSq+r6S/fyGLj937OQt1fu4enM+xeHAhG6jy/oUsUr8Y5OHFXEus/A8uZJH61eb6yMxE1rmZiSyApW1iMa534VFcmP+4fz67C6t3XM9nkfoS+IDwwCXrPw/PZwEMO11cUv6GkBT0Tj+s/A++zeq6cSMaPhJMImziWYG2CWyAaTwrBc8Mj1xyjLH7JrPH1YX6T0QfePhNpuzRN1lAlQ/PZ+D6qubX5dE3mY1Y+R+4ZJsRnRHyBzZx7AqbeDbAckY86waeY/bQJXMtZs+7ZOr+akC/8cglk/rYJROo8pFLJqnvBXjkkpGBld/tXOYmojNCnmOXwvloRhwbqHN6PAvXE3CPz2Vcxuz5cxmkPvc1oDw+l+nmdq53Q3mlj89mnEdIjNvZzLtq8v9EdEbIc2xiOQtmxLKBOqfHsHE96nx8LjMaq2fczmboz9Uj97MZR9zPZgBVPvk6ndQvSHA/m7EbK7/71xmkfsGpPjE9mn1+ekzvBq7SadHsWjwzAAS88eRsuhiz58+m70f0Bfcz6fYeX2cAlZ5JJ/WZdI8zmdOx8rufSZdRnMi9spG+YB3FzpoW3buRq9Q6iu2LZwb3r7PHY/Y72jNnM6Yh+sKjU2n/9TyTDrB8cjqLtMtrU77MesfjdFo7Vn73r59OIjqnvjM9lP3etEh2x7QoNsDSOoq9G88cnqdTd2D1iseZ9C6Po3HvIvqE1+n0Kq/T6UCVnqfSSH0i0Ot0Wp6a/AeIzqjvTI1gL7GOZAN1To0oNsIzh9fptCdYveJ1Ol331wH4K14n0/y9T6UD1aZdQ0iM96n0G5j5T6YHEJ1R35kawfplagS6gat2SjiLgff3f69TaTXYvZ7ugegbPifTDvqcTAMYknpxBN+TqWsw859Ia0oh8Q1Nuo4TBbxlFc4STglHN3IsWefwzOF14qmpmj4H3l+lkvoJWFzwPplu4XsiDebN+gMAABUuSURBVKjS56u0TrdDKaRdINTnVOLHPidSe7Bq8DuVNoPonPrKlFD27ClhHKDWUB6uKzj5fpV6DKtHUCnHyX3jGy6gn47+x1Ob/Y+nAlX6HX/qhJAY/+OpBWryk/p+Bl3GKoRzyyqUA7C0DGWz8M7hf/xpqpoewfUSJKnxP5YaTTmWClR6NJXUjwb7H039HjP/sVTdf90zCTGmMP9hGcIWWoZwAJYWIZyv8MzhczDxY8qx1C41PeKD6CuUIykHAo4+BSo9klKDnkRBSArlaOoczPxHn4LAIynjiM6pb1gFc1ZbBnOAGtvNgkpxXYI+4GjKbnX9QTn6VH9XkAo8/tQo8Ai6kaiWcjTZAiEprs7UvwceSWnErOHLFN1f5YVkTA5iJ1gEcQC2bE+8cwR8mZKE1RsBR1J6gr5K+QzRZwIPp5QGfZkCMPweITFBh5PdsPIHfplcRHRGfcIimGcwOZDdPTmQA7C0oHBs8MxBOZgwPOhwSjdmbx9OLkD0naDDybeCD6cAVQYdTi4n89eAkMNPF2Pl763h4FMronPqCxMp7NuTAjgAy4kBHCreOYIPJZ9R2xeHU75F9J2QQymzQg6lACyDv0ycgpAUty0pb4ccTJFi5j+Uguty05DnWAWzPpxE4TRPonAAlpMDWIvwHDOAgDdCDiXz1PU1/GBAEMTFxeXNsANJtWEHk4FKDyT/TOYmDzuQfB8rf+jBJAn6/ADROXUdcz/2txP9OQBLcz8OFQH4HlGGHUx0wOxntCcOJFeS+ch2UAnfn3wz/EAyUGXY/iRR9AHyLrMVfjDFBiv/8xqStxOdU5cxD+H/29yX22juxwVYTvTjOuKdJfxAUoS6fgjfn3QF7xxaQ/jeBJuIfUkAy7C9SasREhOxL5GDlT98X2IR3OPjh7kP97K5LxeoMR3BmegDSQYRe5O61fVz1L4E3V8AtC9fAyL2JFZE7k0CGJJ6ue3IvUkn1eQHUbuT5hCdUxcxp3CHmnpzlGY+XKBKU29up7kXdyLeWSL3JN1S1wcRe5LgDWIvD1ziuag9iUCVkXsSeqKdkwwQkhLunPJR5J6EVqwaonYnxhCdUxcx8ea4mXr3buQqNfHm4v50aeTelE+idie0YPZAby8nnsA7i9YRvSPls+jdiV3RuxOBahOuIyQmalfiI+z8iSB6TwK8JDiAGHtzbEw8OT0mXlyAYZ0Fpex9BGeidiX+oG7+o3YndMTvix+CdxatJHpXYmTMrkSgymjnBEXknvQPEJISuSNuIlb+5yaEE51Tl+75N/HkME08uUClHpweY0827m9sjtsd97+YXQly9fOf6Id3Fq0lZlfC0jjnBIBlrHPCSYTExO2Mj8fOH98TvRMeBQwEEzy5pyd4cAGWxu4cXNf7/424nfE31fUuasyuhFm//xDkRdCFNON3JpTH70wAqozbmVBDcaL8g6xjF78z3g4r//Ma4nF9C40+MM6DZWLszmk1dkc38lc73p1bOMKN/zbeWRK+SBgdvzOhXf28J7DglSB1g7k97mDCjniA6c64vQiJSdgel662hh2xuN6NpstYuNb8c7wbh2X8hAtUy5GOf4zvWn+/Eb8j3k/9fMeDhO0Je37/IcirSdmb8q+EbfGSxO3xQJUJ2+OqU7ak4L5n7y9J2+LmYeXvdVsci+pM/TvRWbWRcW68X8a78YAqxz3mtRs/5gzKJdeE7Qmz1M412rPb4uqznODdoBqRuC3uctK2OIBl4hexhxESk7QtLkF9DXG4Lkihi4x7xN087nHvRv5qH3F70D8zWKtaJX0RV6hunnvdHndqMDLpBKkbYj5N2hrbkrw1Dqh0S2x93EbyrqWevCXOImlrbA9mDVtjm1O3xg4jOqu2MO5hybSxj7htYx/xgCrHPOQN2jX25C2xR7Hn93dlCc4JuF+G1CmSt8T8nLIlFmCZvDmW1GvuJW+O9VVXQ8qWWFK/Bo0sGDwuGTbmAbdu7EMeeKUPuD1jH3KPDVaep1vjjVI2xyo1mF+QvDnm8mDl0hlS1oV/9HRTrDx1cyxQ5dPNsS0pW2JGIiQlfVPC8NTNMc1YNaCmbY7eSHRWMmP4iPffMfe5xWMe8MArvc/tMrrP3TlYeYCLy5tPN8WkqpvXXjfFSLO2x/5nsLLpFGkbYy6nbYoFavRHSEzahpjT6mpI3RQryVgL7w57FSPc+P82cuUWGN3ngVdpeJ+nMHrAXTGoc7op5ogGffmbZwYzm06Ruynhw/SN0dL0jTFAlWkbo3tS10fOREgK04nyj7SN0RysGnrdEB2DfrIQnZeEG3+WkSsPvFpukdED7vjBzJS6IWZy+oaYNrXz+bw3SX2eSitIXx97NGNDDMAyfX0MK3oBedcLyNwYNSd9Q3SP+jqi4UMivzLiNv8Tg194dMNfeOBVGtzjPv7UteafgzmPKU4p/8pYH8NVN4+/z+fGWP155Teen6AZ66N5meujAZYZ66NJfUIwc130PbU1rIvqyFwTOR3Rc4zuckePvsstNbiHbuh/8S6PbXiHN4+IXBnro3zUzeHvrosqhvd5DBBZ66IXZ62LBlhmrotuz1wdYYKQFPTTI3NtVLnaOtZGVeU6RX6C6Cmj7nLtR90tEY++WwJelNc06k7JEQtXYm6eylwbdVTd3L0wj2ui5xKRU2fJWhMZn702CmC6Jio3xY68L+TMWR05O2tNVLcGdWSR+SsNXhjcLXUedbukY/SdEvCbo26XlI2+yzsx4hqfsPdEZq2OtM9eG9mpdt7+kEJUVp0le0WEUe7qqJbc1VEAy5zVkaT+KpDrFPmduhqe1xHlhugJw11Zn468XRIx6nbvBg9G3uIJR90qcRt1i7cIcQGEnhjNcYo2zlkd1aTJnPXOm1NkM9UpfDiRmXWWvFURp/KcIgGWuasiu5+tjCDtI5foEUquU2S6ujp6a3GK+AbRcUbd5NqPuFkSMfJmyeORt3gnRt0psyJ6o/8N6vKYT3OdIio0mavfXRVB6lvUtRp043m2MoL2bFUkwDJvVUQF1Ym8t17mrQkZ9mxVpFhdHb2uDN9NdF59hLY05N/PVkUUaDRHv89VZBb6SDvR2XWa/JVRltQVkV3UlZEAy2crI4PJ/Oz1s+VRDtSVEZ3q6vi1VlKviKxrZCwJfe/ZyohstXPzwjxFtOYvixzUexL0lvzlEd/mr4gA6qSuCCf16kHU5RGHNakjf0V4Z8HyiFVE59UH6Bvj3s1fHp6m2bxoT6/p3FeBgmUR2QXLIwCmyyK6ClZE2iMkpmBZxGO1dfTWEt6RvzR8JdF5df2wP395eKZG8/Hi3KTCQ/9Bhros2KBgWbictiwcYBsmoi8OG4WQ+EYn2rLwBPV19NbSSV8Wuo3ozLpIgVP0fwuWhRdoNg9/cmm4uHB5tH6/4psoCheHbSlcGg7USV8axmYsjCTtasLsJaHv0ZeG5WtYSw9jaRi8ZXgAYS4OMyxcEsbVZPz/OheFi8OWDmQWSB8pXBL6kLEkDKizcEnoUx6Jb65hLA77uHBxWKkmtTw39C7V2RUuKfaa0BeF2zCWhIo0H/cXeurmwMw+pN/w7VLeZiwOzStaHAY00IvMVwZoS0NGFi0K42tYC2AsCk1izqPAZ837CWNR6BeMxaFtmo73X8Y+A/36NrAdAOkXzEXhw4scQ0XMhWFAAwdlnfj+wp4fMrJoYRhfw1pQS1mLwicTnVubQI8EixaGuvZhjF/UMbSa6ai/z2uQkuIFIXOLHUM6ix1DgXpDvkNIvhNgOobyNaslFDAdQ9qYn4fuIzq3NlC8MMKo2DHkmaZjW/yKsS52DJ1KdB2QV8D6PGQH6/NQoInFC0JJvVILd2HE0OIFoQxN6+mt6fOQYLpD0P+Izk5W2AtCnFmfhzT3ZUxZL45vD3t+yFai64BgwF4Q8h17QQjQzGBS7wTQKxes+SHpmtcTAljzQxo4C4KdiM5OJpj24cPZC0Ii+zKO7FeN7YLgc0TXAlEDepKPMy/Elzs/BGgoqVdsFThR3uHODw7oQz29cuYFBxc7Bo5A9BjgRHmLPT/4EHd+iKKv48f9q/OCHxJdD0RD+HZub/PmBSXy5gUDjXQIvknmqwNoNt68YBfuvKAejWuaFwy4DkFK7rzgM2S+/IkXHIegOdx5wQV9GS+eSoOiybzOBOQV0B3i3uXZB2WWOAQDDfUm+4bCtQ9eUeIQrOhDTb3yHIIruA4hW9FPRETH4doHj+c5BIf1dYxKVGkfnFqzKHxQ1x6EDBBl9pT3S+0D80vtg4BGzg1KFZD8ujp/XuC4krmBdI1relFmiX3Aal3cEfDmUIxL5gb5lMwN6u7n2ICX+yEwmz099D2ia4O8Bhy78I/K5gQWlc0NAppYOjeIw50bOJrsX3FK5wTe0bSmlw0sLZ0TvFtgTXkH0XLK7YPtyuYEBpXOCeru/3gEvWqMqHy7EMKWIYMM8E6gfHYgtXx2ENDEslmB4vLZAYSsPNsXyuYELi6bHViraV0v1Tk7UFI2O+h6xRyKMaJlR3blswOdy2YF0vtbO7aB1Oq5wR8SXSdkgJuGbxeQUTErEGgi3y6wiz8r4DSZTw6iVNp4f1BhF/hE07owzKqcFXio0j50CEJC0PMzFbOCFlbMCvSpmBXYOgD1gldqF/iUt8Dz/4iuF4IDdQ4e71bODEystAsEmloxMyBEGw4FBXZBCyrsArh9qe2V9doFdlfMDEyvtAs8VWEbNJnIHWCFbdCnFXYBGyvtAimVdgHy161NrTMDI3ThaxFEzSdJpS3FRzAzAGisLaVCYBtI2teP/QbTmPKPypkBJyptAxR9qg+z9oD6SltKkMA24FilHcUG3YnikR09MSmwCzKpnEnZXGkbcEdgG8AasBo0sHImxZNqAZ+u1AvQTzWBLeVSlW0A0FSBTUAX+jPa0CSV032GCGwo96psAzr6UqNG42BL6amyCeBX2QbECGwpP1fZUg5X2lLW1NgEzqieThlbZRf0Gfq15LcjB3TDRv/9uYGjq2YEWVfbBCwSzAjY1jsHNgF+VbYBVIEtRTnQWTWuxzbgG7J/1YPgQM0MyvZqG0pHtQ0FaK7/syqbADNtmJA6W8qoaht/96oZlK6+1agnzvBvE0ynbCB6niAEUjWNMqd6OqWhZgYF9MGOmhmUi+jlOG2YvHqbwNHV0ym3qqdTmvtYp85aPcNfWGPjN4PouYGQgGpb32E10/3zaqf7gz45zY9Ta02xQ7QEgTXlPzXT/U/XTPMr73OtumWmwJoylOj5gJDs5GCdtd/9+mn+oB9S6qb6jkS0BIC4vFlv7WdfP83Pr97av7WfNWun1n43gBacx4EQhHAKZVO9tb9MaO0P+uRU/1ahtd9FoR3lX9o0eeIpnv9Xb01ZL5zqFyyc6tfS57oH0Xpr/+7+/6yftG4qZQ3R4w3RAuqmUEY1TPHLbJjiB/qub4PIyu+oNl5PrjPzeLdhqp+j0Mr3WsMUP2b/6h84hVa+XQ1WvtnCKX5XhVN8w4VTfJv69Xum+KZq0xEahAQAu5S/NVj6uTRY+naKrPxAP6wVWvkd4BmS+wlDLOqn+nwssvRbLLL0vSCy9I0VWfrV93MsNLLByq+iwcovqMHK90yDpe/nokk+Q9CdqcjST9i/3+fbLrLyPamLDz9BBokGS59JYkuffLGlL+iXFj51YgvfM1Jrcj9lqClSU+8PxJP9rMWWfl+ILX1cxJa+v4gtfMNFlr65YgsfrsjCp1pk6dv0R/2+rSJLX4nI0rcC/f9iS1+q2NI3Smzpe09s6XNKZOW3QWLhbSOzcv/93nv0n0UWvifFFr71/R53S598dO6IHS2IzhwNNE72Pd442ael0cIX9NPmxsm+N4WTKIZE10NWJBZepmIL3wevO85iC58v4ac+ZMCRWvgaSCZ7x0gm+4D+2jjZu6dxkndS40SfdUCLvx4MFOi9FOKJPqsaJ/kkv8649jrJO1IyyUuvl0GDDAIyc5+FTZN8ONJJPuB1bJroI26a5H1DNtF3uj7diopehpRM9LaTTvJ5IJ3k0/T64+jNkk30/ZzouiB6BHotWWbmfUQ20adJNtEHvLbm3pVSc++fpObeU3RxZ4AekqM7OtlEnytorQMxZlJzH7HU3Hs/+hWN6PogeorUmPIfmbnXJbm5l0Ju7g0GQpm5V73c3MtdYea9Fv39iJaCnsyTTvRaLzfz9pabeYsHanzk5t5ymZnXRfSEJNE1QiC9yCdS/is39f5RbuqtVJh5g4FSburVJTfzpspNvW8ozH1WK82fkPYW1iYzj1EKU3SD97r1PLNX10COhcLMS6Ew9bosG/fHFQMIhFQoTHw+Vph4XWw28WxsNvECeKgw8apUmHiFoX+PwsRztXyC+/jBvL0VWLj+s3m8zySFsee63gwTvEIUJl51eNXbbOIlRv8edCc7WDVCIK8FMPN4V2nssb/Z2LNMOcEL4G2zsWdX8wTPCqWxV4pygqdbs7GXi3KC594WE8/ViglesxUmPmatpt6j0Y0IPXQWjX34+2q36L+jtpp5jEL/DLpxt4z3mtli7LlOOcHzsHKC5xWlsZe70tgrvtnYq7x5glf3oNQ0wZOH1oDucGA7QrQSgFDeUk7wWNwy3jNcaezR1WLsCaCqx0A53qOzd6wmeCxGrxYQPX8QyIChNHoytG28x9dt4z3L28Z7AuifxmCcZ0nbOI9TyrE+pFyUFAIZMNDLfB3j3Ke1j3O/3j7Oo7p9nAfQT92r2sd6XEPHQhcvfUIgakEPczuMPG3bx7hf7xjjwe0Y6wF02jEe3N6NfozbDLjRQyB/odXIe3THGPe9HWM8IjqMPOSdYzyANovW0GHkEdoxxmMPWhuccAikDycQ243cJnYZPdnfaeju02nkLugycgdkttPoSUWn0RNvNDOaHa0BTjgEMkCAMd4fdY52m9tl6H642+DJwy7DJ8+6DJ9Iug3dwWDaZeje1GXgnttt6P6gy/DJITQTMHwEr9NDIEQARrj9G6CfuKOfLAej3dCdw/fdBk8edY92C+02cEvvHu3G6h79pKx7tJu428BN0j3aTdFj8ASgov/c+98MnjT++mdYv/5MaO/vMHjyA/o7gYHbst6/Y4Qb6d+UBIFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCASCDAL/H5mSP8HvHexcAAAAAElFTkSuQmCC"
    // Or: "data:image/jpeg;base64,...." when you get from API
  );
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [clubName, setClubName] = useState("Elite Padel Club Islamabad"); // main display
  const [tempClubName, setTempClubName] = useState(""); // input inside modal
  const [modalVisible, setModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState({
    coords: { latitude: 24.8607, longitude: 67.0011 }, // default
    address: 'Karachi, Pakistan'
  });

  const handleOpenEdit = () => setModalVisible(true);
  const handleCancel = () => setModalVisible(false);

  const handleUpdatePhoto = (newImageDataUri) => {
    // set the clubPhoto to the new base64 data URI
    setClubPhoto(newImageDataUri);
    setModalVisible(false);
    updateClubField("image_url", newImageDataUri);
    // TODO: call your API to persist updated image (send newImageDataUri)
  };
  const handleAmenitiesUpdate = (updated) => {
    setAmenities(updated);
    updateClubField("amenities", updated.map(a => a.label)); // Send only labels
  };

  // For club name
  const handleClubNameUpdate = (newName) => {
    setClubName(newName);
    updateClubField("title", newName);
  };

  // For location
  const handleLocationUpdate = (address, region) => {
    setLocation({ coords: region, address });
    updateClubField("location", region); // Update location with coordinates
  };

  // For contact info
  const handleContactInfoUpdate = (updated) => {
    setContactInfo(updated);
    updateClubField("contactInfo", updated); // Adjust field name as needed
};

  return (
    <ThemedView style={styles.container}>
      {/* Breadcrumbs */}
      {/* <Text style={styles.breadcrumbs}>Dashboard &gt; Club Profile</Text> */}
      <CABreadcrumbs/>
      {/* Scrollable container */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Club Photo */}
        <CAProfileCard  >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Club Photo</Text>
            <TouchableOpacity onPress={handleOpenEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri:clubPhoto
            }}
            style={styles.clubImage}
            resizeMode= "cover"
          />
        </CAProfileCard>

        {/* 2. Club Name */}
        <CAProfileCard>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Club Name</Text>
              <Text style={styles.subtitle}>
              {clubName}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </CAProfileCard>

        {/* 3. Amenities */}
        <CAProfileCard  >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Amenities</Text>
            <TouchableOpacity onPress={() => setAmenitiesModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amenitiesContainer}>
            {amenities.map((item, idx) => (
              <View key={idx} style={styles.amenityPill}>
                <Ionicons
                  name={item.icon}
                  size={16}
                  color="#00BCD4"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </CAProfileCard>

        {/* 4. Location */}
        <CAProfileCard >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Location</Text>
            <TouchableOpacity onPress={()=>setLocationModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Spacer height={20}/>
          <View style={styles.inlineRow}>
            <Ionicons
              name="location-sharp"
              size={16}
              color="#EE3C79"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.subtitle}>
              {location.address}
            </Text>
          </View>
        </CAProfileCard>

        {/* 5. Contact Info */}
        <CAProfileCard style={{marginBottom: 26}}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contact Info</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color="#00BCD4" marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={16} color="#00BCD4"  marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="globe" size={16} color="#00BCD4"  marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.website}</Text>
          </View>
        </CAProfileCard>
      </ScrollView>
      <EditPhotoModal
        visible={modalVisible}
        initialImage={clubPhoto}
        onCancel={handleCancel}
        onUpdate={handleUpdatePhoto}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isNameModalVisible}
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsNameModalVisible(false)} >
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={70} tint="dark" style={styles.modalOverlay}>
          
          <CAProfileCard style={{ maxHeight: "100%", width: "90%" }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
            <Text style={styles.modalTitle}>Edit Club Name</Text>
            <Spacer height={25}/>
            <TextInput
              style={styles.input}
              placeholder="Enter Club Name"
              value={tempClubName}
              onChangeText={setTempClubName}
              placeholderTextColor="#ccc"
            />

            <Spacer height={35}/>


            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsNameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.updateButton}
                onPress={() => {
                  handleClubNameUpdate(tempClubName); // update main state
                  setIsNameModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
            </View>
            </View>
            </TouchableWithoutFeedback>
          </CAProfileCard>
          
        </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
      <AmenitiesModal
        visible={amenitiesModalVisible}
        onClose={() => setAmenitiesModalVisible(false)}
        onUpdate={handleAmenitiesUpdate}
        selectedAmenities={amenities}
      />
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        initialRegion={location.coords}
        initialAddress={location.address}
        onUpdate={(address, region) => setLocation({ coords:region, address })}
      />
      <ContactInfoModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        initialPhone={contactInfo.phone}
        initialEmail={contactInfo.email}
        initialWebsite={contactInfo.website}
        onUpdate={(updated) => setContactInfo(updated)}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  breadcrumbs: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 2,
    marginRight:1,

  },
  editText: {
    fontSize: 14,
    color: "#EE3C79",
    fontWeight: "600",
  },
  clubImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    paddingBottom: 8
  },
  amenityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "rgba(56, 198, 244,0.2)",
  },
  amenityText: {
    color: "#38C6F4",
    fontSize: 14,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#fff"
  },
  input: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#061224',
    color: "#fff"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EE3C79",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },  
});
