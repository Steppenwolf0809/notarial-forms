#!/usr/bin/env node

/**
 * Script de debugging para identificar problemas de asociación de documentos
 * Este script ayuda a diagnosticar por qué un documento muestra datos incorrectos
 */

const fs = require('fs');
const path = require('path');

function debugDocumentAssociation(targetDocumentNumber = '20251701018P01940') {
  console.log('🔍 DEBUGGING DOCUMENT ASSOCIATION ISSUES');
  console.log('==========================================');
  console.log(`Target document: ${targetDocumentNumber}`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log();

  // 1. Check if there are uploaded files in the uploads directory
  const uploadDir = './uploads';
  console.log('1. CHECKING UPLOAD DIRECTORY');
  console.log('----------------------------');
  
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    console.log(`Found ${files.length} files in uploads directory:`);
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024).toFixed(2);
      
      console.log(`  📄 ${file}`);
      console.log(`     Size: ${fileSize} KB`);
      console.log(`     Created: ${stats.birthtime.toISOString()}`);
      console.log(`     Modified: ${stats.mtime.toISOString()}`);
      
      // Check if filename contains our target document number
      if (file.includes(targetDocumentNumber) || file.includes('20251701018')) {
        console.log(`     ⚠️  POTENTIAL MATCH: Contains target document number`);
      }
      
      // Check for potential date references
      if (file.includes('2025') || file.includes('agosto') || file.includes('junio')) {
        console.log(`     📅 Contains date reference`);
      }
      
      console.log();
    });
  } else {
    console.log('❌ Upload directory does not exist');
  }

  // 2. Analyze potential issues
  console.log('2. POTENTIAL ISSUES ANALYSIS');
  console.log('----------------------------');
  
  console.log('Common causes of data association problems:');
  console.log('');
  console.log('a) 🔄 CACHE ISSUES:');
  console.log('   - Redis cache not cleared properly');
  console.log('   - Browser cache showing old data');
  console.log('   - OCR engine cache contamination');
  console.log('');
  
  console.log('b) 🗃️  DATABASE ISSUES:');
  console.log('   - ExtractedFields not properly deleted before new processing');
  console.log('   - DocumentId confusion/collision');
  console.log('   - Race conditions in concurrent processing');
  console.log('');
  
  console.log('c) 📁 FILE ISSUES:');
  console.log('   - Multiple files with similar content in upload directory');
  console.log('   - File path confusion');
  console.log('   - Temporary files not cleaned up');
  console.log('');

  // 3. Recommended debugging steps
  console.log('3. RECOMMENDED DEBUGGING STEPS');
  console.log('------------------------------');
  
  console.log('Step 1: Check the browser network tab');
  console.log('   - Verify the correct document ID is being used in API calls');
  console.log('   - Look for any cached responses');
  console.log('');
  
  console.log('Step 2: Check application logs');
  console.log('   - Look for the enhanced logging messages added');
  console.log('   - Search for your document number: ' + targetDocumentNumber);
  console.log('   - Check for any Redis cache clearing messages');
  console.log('');
  
  console.log('Step 3: Verify document processing');
  console.log('   - Re-upload the document with the same file');
  console.log('   - Monitor logs for: "Cleared X existing extracted fields"');
  console.log('   - Monitor logs for: "Saved X new extracted fields"');
  console.log('');
  
  console.log('Step 4: Database inspection (if possible)');
  console.log('   - Check Documents table for multiple entries');
  console.log('   - Check ExtractedFields table for orphaned records');
  console.log('   - Verify documentId associations are correct');
  console.log('');

  // 4. Quick fix suggestions
  console.log('4. QUICK FIX SUGGESTIONS');
  console.log('------------------------');
  
  console.log('🔧 Immediate fixes to try:');
  console.log('');
  console.log('a) Clear all caches:');
  console.log('   - Hard refresh browser (Ctrl+Shift+R)');
  console.log('   - Clear Redis cache if running');
  console.log('   - Restart the development server');
  console.log('');
  
  console.log('b) Re-process the document:');
  console.log('   - Use the "Force Reprocess" option in the UI');
  console.log('   - Or delete and re-upload the file');
  console.log('');
  
  console.log('c) Check for file duplicates:');
  console.log('   - Remove old files from uploads directory');
  console.log('   - Ensure only the target document is being processed');
  console.log('');

  // 5. Detection commands
  console.log('5. DETECTION COMMANDS');
  console.log('--------------------');
  
  console.log('Use these commands to investigate further:');
  console.log('');
  console.log('# Search for document references in logs:');
  console.log(`grep -r "${targetDocumentNumber}" .`);
  console.log('');
  console.log('# Check for files containing date references:');
  console.log('grep -r "24.*junio\\|junio.*24" .');
  console.log('grep -r "20.*agosto\\|agosto.*20" .');
  console.log('');
  console.log('# Check application logs (if using PM2 or similar):');
  console.log('tail -f logs/app.log | grep -E "(Saved|Cleared|Retrieved)"');
  console.log('');

  console.log('📊 SUMMARY');
  console.log('==========');
  console.log('The enhanced logging should now help track:');
  console.log('- Exact document IDs and filenames');
  console.log('- Field deletion and creation operations'); 
  console.log('- Sample extracted field values');
  console.log('- Document metadata and timestamps');
  console.log('');
  console.log('Monitor the enhanced logs when reproducing the issue.');
  console.log('Look for discrepancies between expected and actual data.');
}

// Run the debug function
if (require.main === module) {
  const targetDoc = process.argv[2] || '20251701018P01940';
  debugDocumentAssociation(targetDoc);
}

module.exports = { debugDocumentAssociation };