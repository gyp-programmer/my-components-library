/*
 * 文本骨架屏
 * 
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-11-05 11:00:38
 * 
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import React from 'react';
import { comp_className } from '../../constants';
import '../index.scss';

export default function TextSkeleton() {
    return (
        <div className={`${comp_className}auto-skeleton-text`}></div>
    )
}
