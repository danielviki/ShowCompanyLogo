<?php
/**
 * Plugin Name: Companies API
 * Description: Create custom company data types and provide access through the REST API
 * Version: 1.0
 * Author: Daniel Zheng
 * Requires Plugins: advanced-custom-fields, jwt-authentication-for-wp-rest-api
 */

if (!defined('ABSPATH')) {
    exit; // 防止直接访问
}

// 注册 Company 自定义数据类型
function create_companies_post_type() {
    register_post_type('company', [
        'labels' => [
            'name' => 'Companies',
            'singular_name' => 'Company',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Company',
            'edit_item' => 'Edit Company',
            'new_item' => 'New Company',
            'view_item' => 'View Company',
            'search_items' => 'Search Companies',
            'not_found' => 'No companies found',
            'not_found_in_trash' => 'No companies found in Trash',
            'all_items' => 'All Companies',
            'archives' => 'Company Archives',
        ],
        'public' => true, // 允许在前端访问
        'has_archive' => true, // 允许归档
        'show_in_rest' => true, // 重要：启用 REST API
        'supports' => ['title', 'editor', 'thumbnail'], // 启用标题、内容、缩略图
        'menu_icon' => 'dashicons-building',
    ]);
}
add_action('init', 'create_companies_post_type');
