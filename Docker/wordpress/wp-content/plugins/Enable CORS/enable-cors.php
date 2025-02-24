<?php
/*
Plugin Name: Enable CORS
Description: Enable CORS for REST API
Version: 1.0
Author: Daniel Zheng
*/

function custom_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://127.0.0.1:5500');  // 修改这里
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        return $value;
    });
}
add_action('rest_api_init', 'custom_cors_headers', 15);