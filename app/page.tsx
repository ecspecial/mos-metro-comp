"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/styles/Global.module.css';

export default function Home() {

  return (
    <div className={styles['global_container_wrapper']}>
		<div className={styles['global_container']}>
            <div className={styles['main_body_logo_text']}>
                <div>
                    <span className={styles['main_body_logo_accent']}>Ц</span><span className={styles['main_body_logo_word']}>ентр</span> 
                </div>
                <div>
                    <span className={styles['main_body_logo_accent']}>O</span><span className={styles['main_body_logo_word']}>беспечения</span> 
                </div>
                <div>
                    <span className={styles['main_body_logo_accent']}>М</span><span className={styles['main_body_logo_word']}>обильности</span> 
                </div>
                <div>
                    <span className={styles['main_body_logo_accent']}>П</span><span className={styles['main_body_logo_word']}>ассажиров</span>
                </div>
            </div>
		</div>
    </div>
  );
}