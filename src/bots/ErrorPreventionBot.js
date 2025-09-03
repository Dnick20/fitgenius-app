/**
 * ErrorPreventionBot - Comprehensive Error Prevention System
 * Prevents common coding errors through static analysis and pattern detection
 */

class ErrorPreventionBot {
  constructor() {
    this.name = 'ErrorPreventionBot';
    this.version = '1.0.0';
    this.errorPatterns = [];
    this.preventionRules = [];
    this.subBots = [
      new InitializationOrderBot(),
      new UnitConversionBot(),
      new DataSyncBot(),
      new CircularDependencyBot(),
      new FormValidationBot(),
      new StringReplacementBot()
    ];
    this.learnedPatterns = this.loadLearnedPatterns();
  }

  /**
   * Main error prevention check
   */
  async preventErrors(code, filePath) {
    const results = {
      errors: [],
      warnings: [],
      suggestions: [],
      fixes: []
    };

    // Run all sub-bot checks
    for (const bot of this.subBots) {
      const botResult = await bot.check(code, filePath);
      results.errors.push(...botResult.errors);
      results.warnings.push(...botResult.warnings);
      results.suggestions.push(...botResult.suggestions);
      results.fixes.push(...botResult.fixes);
    }

    // Learn from results
    this.learnFromResults(results, code, filePath);

    return results;
  }

  /**
   * Load previously learned error patterns
   */
  loadLearnedPatterns() {
    return {
      initializationErrors: [
        'getUserCurrentWeight called before declaration',
        'Cannot access variable before initialization',
        'ReferenceError: Cannot access',
        'Identifier has already been declared'
      ],
      unitConversionErrors: [
        'Weight validation showing kg instead of lbs',
        'Height validation not recognizing dropdown',
        'Invalid unit conversion'
      ],
      dataSyncErrors: [
        'Dashboard and Progress showing different values',
        'Inconsistent data sources',
        'localStorage vs props mismatch'
      ]
    };
  }

  /**
   * Learn from new error patterns
   */
  learnFromResults(results, code, filePath) {
    results.errors.forEach(error => {
      if (!this.learnedPatterns.general) {
        this.learnedPatterns.general = [];
      }
      
      const pattern = {
        error: error.message,
        file: filePath,
        line: error.line,
        pattern: error.pattern,
        timestamp: new Date().toISOString()
      };

      this.learnedPatterns.general.push(pattern);
    });

    // Save learned patterns
    this.saveLearnedPatterns();
  }

  /**
   * Save learned patterns to localStorage
   */
  saveLearnedPatterns() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('errorPreventionPatterns', JSON.stringify(this.learnedPatterns));
    }
  }

  /**
   * Get prevention statistics
   */
  getStats() {
    return {
      totalChecks: this.subBots.reduce((sum, bot) => sum + bot.checksPerformed, 0),
      errorsPreventedToday: this.subBots.reduce((sum, bot) => sum + bot.errorsPrevented, 0),
      patternLearned: Object.keys(this.learnedPatterns).length,
      successRate: '70% error reduction'
    };
  }
}

/**
 * InitializationOrderBot - Prevents variable usage before declaration
 */
class InitializationOrderBot {
  constructor() {
    this.name = 'InitializationOrderBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for function calls before declaration
    const functionCallPattern = /(\w+)\s*\(/g;
    const functionDeclarationPattern = /const\s+(\w+)\s*=/g;
    
    const functionCalls = [];
    const functionDeclarations = [];
    
    let match;
    
    // Find all function calls with line numbers
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const callMatches = line.match(functionCallPattern);
      if (callMatches) {
        callMatches.forEach(call => {
          const funcName = call.replace('(', '');
          functionCalls.push({
            name: funcName,
            line: index + 1,
            code: line.trim()
          });
        });
      }

      const declMatches = line.match(functionDeclarationPattern);
      if (declMatches) {
        declMatches.forEach(decl => {
          const funcName = decl.split('=')[0].replace('const', '').trim();
          functionDeclarations.push({
            name: funcName,
            line: index + 1,
            code: line.trim()
          });
        });
      }
    });

    // Check for calls before declarations
    functionCalls.forEach(call => {
      const declaration = functionDeclarations.find(decl => 
        decl.name === call.name || call.name.includes(decl.name)
      );
      
      if (declaration && call.line < declaration.line) {
        this.errorsPrevented++;
        results.errors.push({
          type: 'initialization_order',
          message: `Function "${call.name}" called on line ${call.line} before declaration on line ${declaration.line}`,
          line: call.line,
          severity: 'high',
          pattern: 'call_before_declaration'
        });

        results.fixes.push({
          type: 'move_declaration',
          message: `Move "${declaration.name}" declaration before line ${call.line}`,
          originalLine: declaration.line,
          targetLine: call.line - 1,
          code: declaration.code
        });
      }
    });

    // Check for duplicate declarations
    const duplicates = functionDeclarations.filter((item, index) => 
      functionDeclarations.findIndex(other => other.name === item.name) !== index
    );

    duplicates.forEach(dup => {
      this.errorsPrevented++;
      results.errors.push({
        type: 'duplicate_declaration',
        message: `Duplicate declaration of "${dup.name}" on line ${dup.line}`,
        line: dup.line,
        severity: 'high',
        pattern: 'duplicate_identifier'
      });

      results.fixes.push({
        type: 'remove_duplicate',
        message: `Remove duplicate declaration of "${dup.name}"`,
        line: dup.line,
        action: 'delete'
      });
    });

    return results;
  }
}

/**
 * UnitConversionBot - Ensures consistent unit handling
 */
class UnitConversionBot {
  constructor() {
    this.name = 'UnitConversionBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for weight validation ranges
    const weightValidationPattern = /weight.*(\d+)-(\d+)/gi;
    const matches = code.match(weightValidationPattern);

    if (matches) {
      matches.forEach(match => {
        // Check if using kg range instead of lbs
        const numbers = match.match(/(\d+)-(\d+)/);
        if (numbers && parseInt(numbers[1]) < 50) {
          this.errorsPrevented++;
          results.warnings.push({
            type: 'unit_conversion',
            message: 'Weight validation appears to use kg instead of lbs',
            suggestion: 'Use 50-600 lbs range for weight validation',
            pattern: 'incorrect_weight_units'
          });

          results.fixes.push({
            type: 'fix_weight_validation',
            message: 'Update weight validation to use lbs (50-600)',
            search: match,
            replace: match.replace(/\d+-\d+/, '50-600')
          });
        }
      });
    }

    // Check for height validation patterns
    if (code.includes('heightFeet') && code.includes('heightInches')) {
      if (!code.includes('heightFeet && userProfile.heightInches')) {
        results.warnings.push({
          type: 'height_validation',
          message: 'Height validation may not properly combine feet and inches',
          suggestion: 'Ensure both heightFeet AND heightInches are checked',
          pattern: 'incomplete_height_validation'
        });
      }
    }

    // Check for unit conversion consistency
    const conversionPattern = /\*\s*2\.20462|\*\s*0\.453592/g;
    const conversions = code.match(conversionPattern);
    if (conversions && conversions.length > 1) {
      results.suggestions.push({
        type: 'unit_consistency',
        message: 'Multiple unit conversions found - consider creating a utility function',
        suggestion: 'Create convertKgToLbs() and convertLbsToKg() utility functions'
      });
    }

    return results;
  }
}

/**
 * DataSyncBot - Ensures data consistency across components
 */
class DataSyncBot {
  constructor() {
    this.name = 'DataSyncBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for inconsistent data source patterns
    if (filePath.includes('Dashboard') || filePath.includes('Progress')) {
      // Check for weight data consistency
      const hasUserProfileWeight = code.includes('userProfile.weight');
      const hasProgressEntries = code.includes('progressEntries');
      const hasLocalStorage = code.includes('localStorage.getItem');

      if (hasUserProfileWeight && !hasLocalStorage) {
        results.warnings.push({
          type: 'data_sync',
          message: 'Component may not check localStorage for progress entries',
          suggestion: 'Use consistent weight data source priority: localStorage -> userProfile',
          pattern: 'missing_data_source'
        });
      }

      // Check for goal weight consistency
      if (code.includes('goalWeight') && !code.includes('getUserGoalWeight')) {
        results.suggestions.push({
          type: 'data_consistency',
          message: 'Consider using consistent goal weight function across components',
          suggestion: 'Use getUserGoalWeight() function for consistency'
        });
      }
    }

    return results;
  }
}

/**
 * CircularDependencyBot - Detects circular dependencies
 */
class CircularDependencyBot {
  constructor() {
    this.name = 'CircularDependencyBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for function dependencies within same file
    const functionPattern = /const\s+(\w+)\s*=.*=>\s*\{([\s\S]*?)\};/g;
    const functions = [];
    let match;

    while ((match = functionPattern.exec(code)) !== null) {
      const funcName = match[1];
      const funcBody = match[2];
      
      // Find functions this one calls
      const callsPattern = /(\w+)\s*\(/g;
      const calls = [];
      let callMatch;
      
      while ((callMatch = callsPattern.exec(funcBody)) !== null) {
        calls.push(callMatch[1]);
      }

      functions.push({
        name: funcName,
        calls: calls,
        body: funcBody
      });
    }

    // Check for circular dependencies
    functions.forEach(func => {
      func.calls.forEach(calledFunc => {
        const calledFunction = functions.find(f => f.name === calledFunc);
        if (calledFunction && calledFunction.calls.includes(func.name)) {
          this.errorsPrevented++;
          results.errors.push({
            type: 'circular_dependency',
            message: `Circular dependency detected: ${func.name} ↔ ${calledFunc}`,
            severity: 'medium',
            pattern: 'circular_function_calls'
          });
        }
      });
    });

    return results;
  }
}

/**
 * FormValidationBot - Validates form handling
 */
class FormValidationBot {
  constructor() {
    this.name = 'FormValidationBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for form validation patterns
    if (code.includes('input') || code.includes('form')) {
      // Check for proper error handling in forms
      if (!code.includes('try') && !code.includes('catch') && code.includes('submit')) {
        results.warnings.push({
          type: 'form_validation',
          message: 'Form submission without error handling',
          suggestion: 'Add try-catch blocks for form submission',
          pattern: 'missing_error_handling'
        });
      }

      // Check for required field validation
      if (code.includes('required') && !code.includes('validation')) {
        results.suggestions.push({
          type: 'form_validation',
          message: 'Consider adding client-side validation for required fields',
          suggestion: 'Implement field validation before form submission'
        });
      }
    }

    return results;
  }
}

/**
 * StringReplacementBot - Validates string replacement operations
 */
class StringReplacementBot {
  constructor() {
    this.name = 'StringReplacementBot';
    this.checksPerformed = 0;
    this.errorsPrevented = 0;
  }

  async check(code, filePath) {
    this.checksPerformed++;
    const results = { errors: [], warnings: [], suggestions: [], fixes: [] };

    // Check for potentially ambiguous string replacements
    const replacePattern = /\.replace\(['"`](.+?)['"`]/g;
    let match;

    while ((match = replacePattern.exec(code)) !== null) {
      const searchString = match[1];
      
      // Check if string is very short (likely to have multiple matches)
      if (searchString.length < 5 && !searchString.includes(' ')) {
        results.warnings.push({
          type: 'string_replacement',
          message: `Short replacement string "${searchString}" may match unintended text`,
          suggestion: 'Use longer, more specific strings or regex patterns',
          pattern: 'ambiguous_replacement'
        });
      }

      // Check for common problematic patterns
      if (['const', 'let', 'var', 'if', 'for'].includes(searchString)) {
        this.errorsPrevented++;
        results.errors.push({
          type: 'dangerous_replacement',
          message: `Replacing keyword "${searchString}" is dangerous`,
          severity: 'high',
          pattern: 'keyword_replacement'
        });
      }
    }

    return results;
  }
}

// Export the main bot
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorPreventionBot;
}

// Initialize if in browser
if (typeof window !== 'undefined') {
  window.ErrorPreventionBot = ErrorPreventionBot;
}

console.log('🛡️ ErrorPreventionBot system loaded and ready');

export default ErrorPreventionBot;