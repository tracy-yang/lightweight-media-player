// 开始回放
{"request_id":"d536e0a4-af07-44eb-a344-5329d1907580","account_token":"","cmd_type":"find_record","request_type":"start","indistinct_query":0,"pu_query":0,"device_id":"Rec17255274764220038","start_time":"2024-09-05T17:11:16","end_time":"2024-09-05T17:17:44","nmedia_url":"0"}

account_token: ""
cmd_type: "playback"
device_id: "Rec17255274764220038"
end_time: "2024-09-05T17:17:44"
nmedia_id: 0
request_id: "439fd5f6-58cc-4aed-9c66-0c254fc74709"
request_type: "start"
sip_file_url: "http://172.16.64.251/mnt/rec2/MV90139192ef2207a502/20221008/RecA8711F875773137D3_163013.mp4"
sip_subject: "20221008-1706"
start_time: "2024-09-05T17:11:16"
stun_server: ""
support_reverse: 0

account_token: ""
cmd_type: "ice"
request_type: "answer"
sdp: "v=0\r\no=- 8253333294440854139 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE audio video\r\na=msid-semantic: WMS\r\nm=audio 9 RTP/SAVPF 8 111 0\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:JhCR\r\na=ice-pwd:hXu/DPl33nDubtfGI+5TAwaG\r\na=ice-options:trickle\r\na=fingerprint:sha-256 2A:EA:40:30:10:A7:63:06:61:A1:95:B2:EE:A2:53:6D:59:17:D2:10:D7:50:99:58:A4:59:FE:62:49:8F:B4:86\r\na=setup:active\r\na=mid:audio\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:111 opus/48000/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\na=rtpmap:0 PCMU/8000\r\nm=video 9 RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:JhCR\r\na=ice-pwd:hXu/DPl33nDubtfGI+5TAwaG\r\na=ice-options:trickle\r\na=fingerprint:sha-256 2A:EA:40:30:10:A7:63:06:61:A1:95:B2:EE:A2:53:6D:59:17:D2:10:D7:50:99:58:A4:59:FE:62:49:8F:B4:86\r\na=setup:active\r\na=mid:video\r\na=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:96 H264/90000\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=fmtp:96 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n"


account_token: ""
candidate: "candidate:3559852009 1 udp 2113937151 efe465fc-1056-45ea-be84-bd1fdf16ca73.local 52567 typ host generation 0 ufrag JhCR network-cost 999"
cmd_type: "ice"
request_type: "candidate"

// 暂停
account_token: ""
cmd_type: "playback"
control_code: 2
npt: 0
request_id: "9f4865a1-091b-4bcc-96ab-a9422e06d187"
request_type: "play_control"
scale: 0


// 恢复
{"request_id":"52fcfcf5-8ca3-4ae4-89ec-9cc6f38195ab","account_token":"","cmd_type":"playback","request_type":"play_control","control_code":3,"scale":0,"npt":0}

// 快放
{"request_id":"6ea99244-e22a-44a8-8a99-df96b29d265b","account_token":"","cmd_type":"playback","request_type":"play_control","control_code":4,"scale":0,"npt":0}

// 正常速度
{"request_id":"c45827f9-d40b-4c25-ba98-8e36cfcc016f","account_token":"","cmd_type":"playback","request_type":"play_control","control_code":7,"scale":0,"npt":0}

// 设置播放速度
{"request_id":"b49fe40e-8b69-4ff0-88f7-0947a44dd4fd","account_token":"","cmd_type":"playback","request_type":"play_control","control_code":8,"scale":0.125,"npt":0.125}
{"request_id":"0573b743-31ef-47ea-941e-d25b0e594461","account_token":"","cmd_type":"playback","request_type":"play_control","control_code":8,"scale":2,"npt":2}

// 开始下载
{"request_id":"713a709e-3433-49f4-94b3-5b8849d3f78f","account_token":"","cmd_type":"download","request_type":"start","device_id":"Rec17255274764220038","start_time":"2024-09-05T17:11:16","end_time":"2024-09-05T17:17:44","nmedia_id":0,"nmedia_url":"","stun_server":null,"transfer_chunked":1,"windows_media_player_compatible":0,"download_speed":4,"tag":"测试","water_mark":{"font_size":24,"font_color":"#FFFFFF","opacity":0.15,"rotate_angle":15,"tile_width":274,"tile_height":192,"text_info":[{"text_pos":1,"pos_x":0,"pos_y":0,"overlay_text":"ezviewadmin"}]}}

// 停止下载
{"request_id":"9370f994-aeba-496e-8e39-50d9326db770","account_token":"","cmd_type":"download","request_type":"stop","device_id":"Rec17255274764220038","download_speed":4}


// 停止回放
{"request_id":"bbfb7cdf-7474-4b33-bebb-84032216c330","account_token":"","cmd_type":"playback","request_type":"stop","device_id":"Rec17255274764220038"}

// 重播（同一个视频循环播放）request_id是不同的
{"account_token":"","cmd_type":"playback","request_type":"play_control","session_id":10268,"npt":0,"control_code":9,"traceId":"35bfcb61-8cfe-411c-9c3a-a975ef78ff97","spanId":"aa3d5f0a-55c3-49dc-86a0-2cc0cdfd9ffa","sw8":"1-MzViZmNiNjEtOGNmZS00MTFjLTljM2EtYTk3NWVmNzhmZjk3-YmE0YTdmM2UtN2NlNC00OTc0LThmODYtMjcxOGY4YjhiNzgx-0-S01lZGlhVW5p-MTcyNzMzOTI4ODk1Mg==-aHR0cHM6Ly8xMC42Ni44LjI4L3ZjLyMvZGlzcGF0Y2gvdHYtd2FsbA==-","request_id":"m1j1be6twwtx8lt44b"}